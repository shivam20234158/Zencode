import { Queue } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redisConnection = new Redis(process.env.UPSTASH_REDIS_URL, {
    maxRetriesPerRequest: null,
});

export const submissionQueue = new Queue("code-execution", {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 2,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 200,
    },
});
