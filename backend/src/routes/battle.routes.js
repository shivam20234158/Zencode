import express from "express";
import {
    createBattle,
    joinBattle,
    getBattle,
    submitBattleSolution,
    getUserBattleHistory,
    getUserBattleStats,
} from "../controllers/battle.controller.js";
import userMiddleware from "../middleware/user.middleware.js";

const battleRouter = express.Router();

battleRouter.post("/create", userMiddleware, createBattle);
battleRouter.post("/join", userMiddleware, joinBattle);
battleRouter.get("/user/history", userMiddleware, getUserBattleHistory);
battleRouter.get("/user/stats", userMiddleware, getUserBattleStats);
battleRouter.get("/:idOrCode", userMiddleware, getBattle);
battleRouter.post("/:battleId/submit", userMiddleware, submitBattleSolution);

export default battleRouter;
