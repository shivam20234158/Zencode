import express from "express";

import {
    runCode,
    submitCode,
    getSubmissionHistory,
    getSolvedProblems,
} from "../controllers/submission.controller.js";

import userMiddleware from "../middleware/user.middleware.js";

const submissionRouter = express.Router();

submissionRouter.post(
    "/run/:problemId",
    userMiddleware,
    runCode
);

submissionRouter.post(
    "/submit/:problemId",
    userMiddleware,
    submitCode
);

submissionRouter.get(
    "/history/:problemId",
    userMiddleware,
    getSubmissionHistory
);

submissionRouter.get(
    "/solved",
    userMiddleware,
    getSolvedProblems
);

export default submissionRouter;