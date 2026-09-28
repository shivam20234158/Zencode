import Problem from "../models/problem.model.js";
import Submission from "../models/submission.model.js";
import User from "../models/user.model.js";
import { executeCode } from "../utils/executionUtility.js";
import { submissionQueue } from "../config/queue.js";

export const runCode = async (req, res) => {

    try {

        const userId = req.user._id;

        const { problemId } = req.params;

        const { code, language } = req.body;

        if (!userId || !problemId || !code || !language) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found",
            });
        }

        const result = await executeCode(
            code,
            language,
            problem.visibleTestCases
        );

        return res.status(200).json(result);

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};

export const submitCode = async (req, res) => {

    try {

        const userId = req.user._id;

        const { problemId } = req.params;

        const { code, language } = req.body;

        if (!userId || !problemId || !code || !language) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found",
            });
        }

        // 1. Create submission with "queued" status
        const submission = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: "queued",
            testCasesTotal: problem.hiddenTestCases?.length || 0,
        });

        // 2. Add job to BullMQ queue
        await submissionQueue.add("execute-code", {
            submissionId: submission._id.toString(),
            userId: userId.toString(),
            problemId: problemId.toString(),
            code,
            language,
            testCases: problem.hiddenTestCases || [],
        });

        // 3. Return 202 Accepted immediately
        return res.status(202).json({
            submissionId: submission._id,
            status: "queued",
            message: "Submission queued for execution",
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};

export const getSubmissionStatus = async (req, res) => {

    try {

        const { submissionId } = req.params;

        if (!submissionId) {
            return res.status(400).json({
                message: "Submission ID is required",
            });
        }

        const submission = await Submission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({
                message: "Submission not found",
            });
        }

        if (submission.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized access to submission",
            });
        }

        if (submission.status === "queued" || submission.status === "processing") {
            return res.status(200).json({
                submissionId: submission._id,
                status: submission.status,
            });
        }

        return res.status(200).json({
            submissionId: submission._id,
            status: submission.status,
            accepted: submission.status === "accepted",
            passedTestCases: submission.testCasesPassed,
            totalTestCases: submission.testCasesTotal,
            runtime: submission.runtime,
            memory: submission.memory,
            errorMessage: submission.errorMessage,
            stdout: submission.stdout,
            compileOutput: submission.compileOutput,
            createdAt: submission.createdAt,
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};
export const getSolvedProblems = async (req, res) => {

    try {

        const user = await User.findById(req.user._id)
            .populate({
                path: "problemSolved",
                select: "_id title difficulty tags",
            });

        return res.status(200).json(user.problemSolved);

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};
export const getSubmissionHistory = async (req, res) => {

    try {

        const { problemId } = req.params;

        const submissions = await Submission.find({

            userId: req.user._id,

            problemId,

        }).sort({
            createdAt: -1,
        });

        return res.status(200).json(submissions);

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};