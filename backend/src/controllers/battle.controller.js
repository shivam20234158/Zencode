import * as battleService from "../services/battle.service.js";
import Battle from "../models/battle.model.js";
import Submission from "../models/submission.model.js";
import User from "../models/user.model.js";
import { submissionQueue } from "../config/queue.js";

// POST /api/battles/create
export const createBattle = async (req, res) => {
    try {
        const { difficulty } = req.body;
        if (!difficulty) {
            return res.status(400).json({ message: "Difficulty is required (Easy, Medium, Hard)." });
        }

        const battle = await battleService.createBattle(req.user._id, difficulty);
        return res.status(201).json(battle);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// POST /api/battles/join
export const joinBattle = async (req, res) => {
    try {
        const { roomCode } = req.body;
        if (!roomCode) {
            return res.status(400).json({ message: "Room code is required." });
        }

        const battle = await battleService.joinBattle(req.user._id, roomCode.toUpperCase().trim());
        return res.status(200).json(battle);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// GET /api/battles/:idOrCode
export const getBattle = async (req, res) => {
    try {
        const { idOrCode } = req.params;
        const battle = await battleService.getBattleDetails(idOrCode);

        if (!battle) {
            return res.status(404).json({ message: "Battle not found." });
        }

        return res.status(200).json(battle);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// POST /api/battles/:battleId/submit
export const submitBattleSolution = async (req, res) => {
    try {
        const { battleId } = req.params;
        const { code, language } = req.body;
        const userId = req.user._id;

        if (!code || !language) {
            return res.status(400).json({ message: "Code and language are required." });
        }

        const battle = await Battle.findById(battleId).populate("problem");
        if (!battle) {
            return res.status(404).json({ message: "Battle not found." });
        }

        if (battle.status !== "active") {
            return res.status(400).json({ message: `Cannot submit. Battle is ${battle.status}.` });
        }

        const isPlayer = battle.players.some((p) => p.user.toString() === userId.toString());
        if (!isPlayer) {
            return res.status(403).json({ message: "You are not a participant in this battle." });
        }

        // Check if deadline has passed
        if (battle.deadline && new Date() > new Date(battle.deadline)) {
            await battleService.handleBattleTimeout(battleId);
            return res.status(400).json({ message: "Battle time has expired." });
        }

        const problem = battle.problem;

        // Create submission
        const submission = await Submission.create({
            userId,
            problemId: problem._id,
            code,
            language,
            status: "queued",
            testCasesTotal: problem.hiddenTestCases?.length || 0,
        });

        // Record submission on battle player
        await battleService.recordPlayerSubmission(
            battle._id,
            userId,
            submission._id,
            "submitted"
        );

        // Add to BullMQ with battle metadata
        await submissionQueue.add("execute-code", {
            submissionId: submission._id.toString(),
            userId: userId.toString(),
            problemId: problem._id.toString(),
            code,
            language,
            testCases: problem.hiddenTestCases || [],
            battleId: battle._id.toString(),
        });

        return res.status(202).json({
            submissionId: submission._id,
            status: "queued",
            message: "Battle submission queued for execution.",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET /api/battles/user/history
export const getUserBattleHistory = async (req, res) => {
    try {
        const battles = await battleService.getUserBattles(req.user._id);
        return res.status(200).json(battles);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET /api/battles/user/stats
export const getUserBattleStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("battleStats name email");
        return res.status(200).json({
            stats: user?.battleStats || { won: 0, lost: 0, drawn: 0 },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
