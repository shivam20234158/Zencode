import { Worker } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";
import * as battleService from "../services/battle.service.js";
import { emitToBattle } from "../socket/battleSocket.js";
import Battle from "../models/battle.model.js";

dotenv.config();

let timeoutWorker = null;

export const startBattleTimeoutWorker = () => {
    if (timeoutWorker) return timeoutWorker;

    const connection = new Redis(process.env.UPSTASH_REDIS_URL, {
        maxRetriesPerRequest: null,
    });

    timeoutWorker = new Worker(
        "battle-timeouts",
        async (job) => {
            const { battleId, roomCode } = job.data;

            if (job.name === "waiting-timeout") {
                const battle = await Battle.findById(battleId);
                if (battle && battle.status === "waiting") {
                    await battleService.handleWaitingTimeout(battleId);
                    emitToBattle(roomCode, "battle-cancelled", {
                        reason: "Waiting room expired. No opponent joined within 2 minutes.",
                    });
                }
            } else if (job.name === "battle-deadline") {
                const battle = await Battle.findById(battleId);
                if (battle && battle.status === "active") {
                    const finalized = await battleService.handleBattleTimeout(battleId);
                    emitToBattle(roomCode, "battle-ended", {
                        isDraw: true,
                        winner: null,
                        battle: finalized,
                    });
                }
            }
        },
        {
            connection,
            concurrency: 5,
        }
    );

    timeoutWorker.on("error", (err) => {
        console.error("[BattleTimeoutWorker] Error:", err.message);
    });

    return timeoutWorker;
};
