import Problem from "../models/problem.model.js";
import Submission from "../models/submission.model.js";
import User from "../models/user.model.js";
import { executeCode } from "../utils/executionUtility.js";

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

        const result = await executeCode(
            code,
            language,
            problem.hiddenTestCases
        );

        const submission = await Submission.create({

            userId,

            problemId,

            code,

            language,

            status: result.success ? "accepted" : "wrong",

            runtime: result.runtime,

            memory: result.memory,

            stdout: result.testResults
                .map(test => test.stdout)
                .join("\n"),

            stderr: result.errorMessage || "",

            compileOutput: result.testResults
                .map(test => test.compile_output)
                .filter(Boolean)
                .join("\n"),

            errorMessage: result.errorMessage || "",

            testCasesPassed: result.testCasesPassed,

            testCasesTotal: result.totalTestCases,

        });

        if (result.success) {

            await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: {
                        problemSolved: problemId,
                    },
                }
            );

        }

        return res.status(201).json({

            accepted: result.success,

            submissionId: submission._id,

            passedTestCases: result.testCasesPassed,

            totalTestCases: result.totalTestCases,

            runtime: result.runtime,

            memory: result.memory,

            errorMessage: result.errorMessage,

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