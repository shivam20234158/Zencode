import express from "express";

import {
    createProblem,
    updateProblem,
    deleteProblem,
    getProblemById,
    getAllProblems,
} from "../controllers/problem.controller.js";

import userMiddleware from "../middleware/user.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const problemRouter = express.Router();

// Public / Logged-in user
problemRouter.get("/", getAllProblems);

problemRouter.get("/:id", getProblemById);

// Admin only
problemRouter.post(
    "/create",
    userMiddleware,
    adminMiddleware,
    createProblem
);

problemRouter.put(
    "/update/:id",
    userMiddleware,
    adminMiddleware,
    updateProblem
);

problemRouter.delete(
    "/delete/:id",
    userMiddleware,
    adminMiddleware,
    deleteProblem
);

export default problemRouter;