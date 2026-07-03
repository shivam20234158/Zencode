import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = new Redis(process.env.UPSTASH_REDIS_URL);

redisClient.on("connect", () => {
    console.log("✅ Redis Connected");
});

redisClient.on("error", (err) => {
    console.log("Redis Error:", err.message);
});

export default redisClient;