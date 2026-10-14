import { Worker } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";
import Submission from "../models/submission.model.js";
import User from "../models/user.model.js";
import Battle from "../models/battle.model.js";
import { executeCode } from "../utils/executionUtility.js";
import * as battleService from "../services/battle.service.js";
import { emitToBattle } from "../socket/battleSocket.js";

dotenv.config();

let worker = null;

export const startWorker = () => {
    if (worker) return worker;

    const workerConnection = new Redis(process.env.UPSTASH_REDIS_URL, {
        maxRetriesPerRequest: null,
    });

    worker = new Worker(
        "code-execution",
        async (job) => {
            const {
                submissionId,
                userId,
                problemId,
                code,
                language,
                testCases,
            } = job.data;

            console.log(`[Worker] Starting job ${job.id} for submission ${submissionId}`);

            try {
                // Update submission status to processing
                await Submission.findByIdAndUpdate(submissionId, {
                    status: "processing",
                });

                // Execute code via Judge0
                const result = await executeCode(code, language, testCases);

                const finalStatus = result.success ? "accepted" : "wrong";

                // Update submission with complete results
                const stdoutText = (result.testResults || [])
                    .map((test) => test.stdout)
                    .filter(Boolean)
                    .join("\n");

                const compileText = (result.testResults || [])
                    .map((test) => test.compile_output)
                    .filter(Boolean)
                    .join("\n");

                await Submission.findByIdAndUpdate(submissionId, {
                    status: finalStatus,
                    runtime: result.runtime || 0,
                    memory: result.memory || 0,
                    stdout: stdoutText,
                    stderr: result.errorMessage || "",
                    compileOutput: compileText,
                    errorMessage: result.errorMessage || "",
                    testCasesPassed: result.testCasesPassed || 0,
                    testCasesTotal: result.totalTestCases || 0,
                });

                // If all testcases passed, update User's solved list
                if (result.success) {
                    await User.findByIdAndUpdate(userId, {
                        $addToSet: {
                            problemSolved: problemId,
                        },
                    });
                }

                // Battle real-time progress & winner finalization
                if (job.data.battleId) {
                    try {
                        const { battleId } = job.data;
                        const battle = await Battle.findById(battleId);
                        if (battle && battle.status === "active") {
                            if (result.success) {
                                const finalized = await battleService.tryFinalizeWinner(
                                    battleId,
                                    userId,
                                    submissionId
                                );
                                if (finalized) {
                                    emitToBattle(battle.roomCode, "battle-ended", {
                                        winner: finalized.winner,
                                        isDraw: false,
                                        battle: finalized,
                                    });
                                }
                            } else {
                                await battleService.recordPlayerSubmission(
                                    battleId,
                                    userId,
                                    submissionId,
                                    "failed"
                                );
                            }

                            emitToBattle(battle.roomCode, "opponent-progress", {
                                userId,
                                status: result.success ? "accepted" : "failed",
                                testCasesPassed: result.testCasesPassed || 0,
                                testCasesTotal: result.totalTestCases || 0,
                            });
                        }
                    } catch (battleErr) {
                        console.error("[Worker] Battle handling error:", battleErr.message);
                    }
                }

                console.log(
                    `[Worker] Job ${job.id} completed. Status: ${finalStatus} (${result.testCasesPassed}/${result.totalTestCases})`
                );

                return {
                    success: true,
                    submissionId,
                    status: finalStatus,
                };
            } catch (err) {
                console.error(`[Worker] Error in job ${job.id}:`, err);

                await Submission.findByIdAndUpdate(submissionId, {
                    status: "error",
                    errorMessage: err.message || "Execution failed",
                });

                throw err;
            }
        },
        {
            connection: workerConnection,
            concurrency: 5,
        }
    );

    worker.on("completed", (job) => {
        console.log(`[Worker] Job ${job.id} marked as completed`);
    });

    worker.on("failed", (job, err) => {
        console.error(`[Worker] Job ${job?.id} failed with error:`, err?.message);
    });

    worker.on("error", (err) => {
        console.error("[Worker] Worker error:", err?.message);
    });

    console.log("🚀 Submission queue worker initialized");
    return worker;
};
