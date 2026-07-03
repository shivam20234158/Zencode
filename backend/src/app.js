//Express app banayega
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import problemRouter from "./routes/problem.routes.js";
import submissionRouter from "./routes/submission.routes.js";
import videoRouter from "./routes/video.routes.js";
import aiRouter from "./routes/ai.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Frontend agar bheje:
// {
//     "email":"abc@gmail.com",
//     "password":"123456"
// }
//To ye middleware us JSON ko parse karega.
app.use(express.json());
//JWT cookies read karne ke liye.
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use("/api/auth",authRouter)
app.use("/api/problems",problemRouter)
app.use("/api/submissions", submissionRouter);
app.use("/api/videos",videoRouter)
app.use("/api/ai",aiRouter)
app.get("/", (req, res) => {
    res.send("Backend is Running 🚀");
});

export default app;