import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { startWorker } from "./workers/submission.worker.js";
import { startBattleTimeoutWorker } from "./workers/battleTimeout.worker.js";
import { initSocket } from "./config/socket.js";
import { setupBattleSocket } from "./socket/battleSocket.js";
import { fileURLToPath } from "url";
import path from "path";
import express from "express";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../../frontend/dist");

if (process.env.NODE_ENV === "production") {
    app.use(express.static(frontendPath));

    app.use((req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

const httpServer = http.createServer(app);
const io = initSocket(httpServer);
setupBattleSocket(io);

const startServer = async () => {
    try {
        await connectDB();
        startWorker();
        startBattleTimeoutWorker();
        httpServer.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error.message);
    }
};

startServer();