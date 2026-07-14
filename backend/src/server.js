// Server start karega aur database connect karega.

import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
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
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error.message);
    }
};

startServer();