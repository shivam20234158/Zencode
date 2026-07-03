import express from "express";

import solveDoubt from "../controllers/ai.controller.js";
import userMiddleware from "../middleware/user.middleware.js";

const aiRouter = express.Router();

aiRouter.post(
    "/chat",
    userMiddleware,
    solveDoubt
);

export default aiRouter;