import { customAlphabet } from "nanoid";
import Battle from "../models/battle.model.js";
import Problem from "../models/problem.model.js";
import User from "../models/user.model.js";
import { battleQueue } from "../config/queue.js";
import { emitToBattle } from "../socket/battleSocket.js";

const generateRoomCode = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 6);

const DIFFICULTY_TIME_LIMITS = {
    Easy: 15,
    Medium: 30,
    Hard: 45,
};

// Create a new battle room
export const createBattle = async (userId, difficulty) => {
    const timeLimitMinutes = DIFFICULTY_TIME_LIMITS[difficulty];
    if (!timeLimitMinutes) {
        throw new Error("Invalid difficulty. Must be Easy, Medium, or Hard.");
    }

    // Pick a random problem matching difficulty
    const problems = await Problem.aggregate([
        { $match: { difficulty } },
        { $sample: { size: 1 } },
    ]);

    if (!problems || problems.length === 0) {
        throw new Error(`No problems found with difficulty: ${difficulty}`);
    }

    const problem = problems[0];
    const roomCode = generateRoomCode();
    const waitingDeadline = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    const battle = await Battle.create({
        roomCode,
        problem: problem._id,
        difficulty,
        timeLimitMinutes,
        players: [
            {
                user: userId,
                status: "coding",
            },
        ],
        status: "waiting",
        waitingDeadline,
    });

    // Schedule 2-minute waiting timeout
    try {
        const waitingJob = await battleQueue.add(
            "waiting-timeout",
            { battleId: battle._id.toString(), roomCode: battle.roomCode },
            { delay: 2 * 60 * 1000 }
        );
        await Battle.findByIdAndUpdate(battle._id, { waitingTimeoutJobId: waitingJob.id });
    } catch (qErr) {
        console.error("Failed to schedule waiting timeout:", qErr.message);
    }

    return Battle.findById(battle._id)
        .populate("problem", "title description difficulty visibleTestCases tags")
        .populate("players.user", "name email");
};

// Join an existing battle room
export const joinBattle = async (userId, roomCode) => {
    const existing = await Battle.findOne({ roomCode });
    if (!existing) {
        throw new Error("Battle room not found.");
    }

    // If already a player in this battle, return current state
    const isPlayer = existing.players.some(
        (p) => p.user.toString() === userId.toString()
    );
    if (isPlayer) {
        return Battle.findById(existing._id)
            .populate("problem", "title description difficulty visibleTestCases tags")
            .populate("players.user", "name email");
    }

    if (existing.status !== "waiting") {
        throw new Error(`Cannot join room. Current status is ${existing.status}.`);
    }

    if (existing.players.length >= 2) {
        throw new Error("Battle room is already full.");
    }

    const now = new Date();
    const deadline = new Date(now.getTime() + existing.timeLimitMinutes * 60 * 1000);

    // Atomically add player 2 and activate battle
    const updatedBattle = await Battle.findOneAndUpdate(
        {
            _id: existing._id,
            status: "waiting",
            "players.1": { $exists: false },
            "players.0.user": { $ne: userId },
        },
        {
            $push: { players: { user: userId, status: "coding" } },
            $set: {
                status: "active",
                startedAt: now,
                deadline,
            },
        },
        { new: true }
    )
        .populate("problem", "title description difficulty visibleTestCases tags")
        .populate("players.user", "name email");

    if (!updatedBattle) {
        throw new Error("Failed to join room. Room may be full or already started.");
    }

    // Schedule battle deadline timeout and broadcast start
    try {
        const deadlineJob = await battleQueue.add(
            "battle-deadline",
            { battleId: updatedBattle._id.toString(), roomCode: updatedBattle.roomCode },
            { delay: existing.timeLimitMinutes * 60 * 1000 }
        );
        await Battle.findByIdAndUpdate(updatedBattle._id, { battleDeadlineJobId: deadlineJob.id });
    } catch (qErr) {
        console.error("Failed to schedule battle deadline:", qErr.message);
    }

    emitToBattle(updatedBattle.roomCode, "battle-started", { battle: updatedBattle });

    return updatedBattle;
};

// Get battle by ID or room code
export const getBattleDetails = async (identifier) => {
    const query = identifier.length === 6 ? { roomCode: identifier } : { _id: identifier };
    return Battle.findOne(query)
        .populate("problem", "title description difficulty visibleTestCases tags")
        .populate("players.user", "name email")
        .populate("winner", "name email");
};

// Atomically finalize winner upon accepted submission
export const tryFinalizeWinner = async (battleId, userId, submissionId) => {
    const battle = await Battle.findById(battleId);
    if (!battle || battle.status !== "active") return null;

    // Check if past deadline
    if (battle.deadline && new Date() > new Date(battle.deadline)) {
        await handleBattleTimeout(battleId);
        return null;
    }

    const now = new Date();
    const updated = await Battle.findOneAndUpdate(
        { _id: battleId, status: "active", winner: null },
        {
            $set: {
                winner: userId,
                status: "completed",
                endedAt: now,
                "players.$[elem].status": "accepted",
                "players.$[elem].acceptedSubmissionId": submissionId,
                "players.$[elem].acceptedAt": now,
            },
        },
        {
            arrayFilters: [{ "elem.user": userId }],
            new: true,
        }
    )
        .populate("problem", "title description difficulty visibleTestCases tags")
        .populate("players.user", "name email")
        .populate("winner", "name email");

    if (updated) {
        await updateBattleStats(updated._id);
    }

    return updated;
};

// Record submission attempt for a player
export const recordPlayerSubmission = async (battleId, userId, submissionId, status) => {
    return Battle.findOneAndUpdate(
        { _id: battleId, "players.user": userId },
        {
            $inc: { "players.$.submissionCount": 1 },
            $set: {
                "players.$.lastSubmissionId": submissionId,
                "players.$.status": status,
            },
        },
        { new: true }
    );
};

// Handle waiting room 2-min timeout
export const handleWaitingTimeout = async (battleId) => {
    return Battle.findOneAndUpdate(
        { _id: battleId, status: "waiting" },
        {
            $set: {
                status: "cancelled",
                endedAt: new Date(),
            },
        },
        { new: true }
    );
};

// Handle battle deadline timeout
export const handleBattleTimeout = async (battleId) => {
    const updated = await Battle.findOneAndUpdate(
        { _id: battleId, status: "active" },
        {
            $set: {
                status: "completed",
                isDraw: true,
                endedAt: new Date(),
            },
        },
        { new: true }
    )
        .populate("problem", "title description difficulty visibleTestCases tags")
        .populate("players.user", "name email");

    if (updated) {
        await updateBattleStats(updated._id);
    }

    return updated;
};

// Update user battle stats (idempotent)
export const updateBattleStats = async (battleId) => {
    const battle = await Battle.findById(battleId);
    if (!battle || battle.statsUpdated || battle.status !== "completed") return;

    // Atomically set flag to prevent double increments
    const locked = await Battle.findOneAndUpdate(
        { _id: battleId, statsUpdated: false, status: "completed" },
        { $set: { statsUpdated: true } },
        { new: true }
    );
    if (!locked) return;

    if (locked.isDraw) {
        for (const player of locked.players) {
            await User.findByIdAndUpdate(player.user, {
                $inc: { "battleStats.drawn": 1 },
            });
        }
    } else if (locked.winner) {
        await User.findByIdAndUpdate(locked.winner, {
            $inc: { "battleStats.won": 1 },
        });
        const loser = locked.players.find(
            (p) => p.user.toString() !== locked.winner.toString()
        );
        if (loser) {
            await User.findByIdAndUpdate(loser.user, {
                $inc: { "battleStats.lost": 1 },
            });
        }
    }
};

// Get battle history for a user
export const getUserBattles = async (userId) => {
    return Battle.find({ "players.user": userId })
        .populate("problem", "title difficulty")
        .populate("players.user", "name email")
        .populate("winner", "name email")
        .sort({ createdAt: -1 })
        .limit(20);
};
