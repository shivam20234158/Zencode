import { getIO } from "../config/socket.js";
import Battle from "../models/battle.model.js";

export const setupBattleSocket = (io) => {
    io.on("connection", (socket) => {
        const user = socket.user;

        // Join a battle room
        socket.on("join-room", async ({ roomCode }) => {
            if (!roomCode) return;

            const roomName = `battle:${roomCode}`;
            socket.join(roomName);

            try {
                const battle = await Battle.findOne({ roomCode })
                    .populate("problem", "title description difficulty visibleTestCases tags")
                    .populate("players.user", "name email");

                if (!battle) {
                    socket.emit("battle-error", { message: "Battle room not found" });
                    return;
                }

                // If both players are present and battle is active, notify both
                if (battle.status === "active" && battle.players.length === 2) {
                    io.to(roomName).emit("battle-started", { battle });
                } else if (battle.status === "waiting") {
                    io.to(roomName).emit("player-joined", {
                        user: { _id: user._id, name: user.name, email: user.email },
                        battle,
                    });
                }
            } catch (err) {
                socket.emit("battle-error", { message: err.message });
            }
        });

        // Leave a battle room
        socket.on("leave-room", ({ roomCode }) => {
            if (!roomCode) return;
            socket.leave(`battle:${roomCode}`);
        });

        socket.on("disconnect", () => {
            // Socket disconnected
        });
    });
};

// Broadcast an event to all participants in a battle room
export const emitToBattle = (roomCode, event, data) => {
    try {
        const io = getIO();
        io.to(`battle:${roomCode}`).emit(event, data);
    } catch (err) {
        console.error(`Socket broadcast error [${event}]:`, err.message);
    }
};
