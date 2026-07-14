import SolutionVideo from "../models/solutionVideo.model.js";
import Problem from "../models/problem.model.js";
import { getLanguageById } from "../utils/problemUtility.js";

export const createProblem = async (req, res) => {

    try {

        const existingProblem = await Problem.findOne({
            title: req.body.title,
        });

        if (existingProblem) {
            return res.status(400).json({
                message: "Problem already exists",
            });
        }

        req.body.createdBy = req.user._id;

        const problem = await Problem.create(req.body);

        return res.status(201).json({
            problem,
            message: "Problem created successfully",
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};
export const updateProblem = async (req, res) => {

    const { id } = req.params;

    const {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        referenceSolution,
    } = req.body;

    try {

        if (!id) {
            return res.status(400).json({
                message: "Problem ID is required",
            });
        }

        const existingProblem = await Problem.findById(id);

        if (!existingProblem) {
            return res.status(404).json({
                message: "Problem not found",
            });
        }

        // Validate reference solutions on visible test cases
        for (const { language, completeCode } of referenceSolution) {

            const languageId = getLanguageById(language);

            const submissions = visibleTestCases.map((testCase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testCase.input,
                expected_output: testCase.output,
            }));

            const submitResult = await submitBatch(submissions);

            const tokens = submitResult.map((result) => result.token);

            const testResults = await submitToken(tokens);

            for (const test of testResults) {

                if (test.status_id !== 3) {
                    return res.status(400).json({
                        message:
                            "Reference solution failed on visible test cases",
                    });
                }

            }

        }

        const updatedProblem = await Problem.findByIdAndUpdate(
            id,
            {
                title,
                description,
                difficulty,
                tags,
                visibleTestCases,
                hiddenTestCases,
                startCode,
                referenceSolution,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            problem: updatedProblem,
            message: "Problem Updated Successfully",
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};
export const deleteProblem = async (req, res) => {

    const { id } = req.params;

    try {

        if (!id) {
            return res.status(400).json({
                message: "Problem ID is required",
            });
        }

        const deletedProblem = await Problem.findByIdAndDelete(id);

        if (!deletedProblem) {
            return res.status(404).json({
                message: "Problem not found",
            });
        }

        return res.status(200).json({
            message: "Problem Deleted Successfully",
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};
export const getAllProblems = async (req, res) => {

    try {

        const problems = await Problem.find({})
            .select("_id title difficulty tags");

        return res.status(200).json({
            problems,
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};
export const getProblemById = async (req, res) => {

    const { id } = req.params;

    try {

        if (!id) {
            return res.status(400).json({
                message: "Problem ID is required",
            });
        }

        const problem = await Problem.findById(id)
            .select(
                "_id title description difficulty tags constraints visibleTestCases startCode referenceSolution"
            );

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found",
            });
        }

        const video = await SolutionVideo.findOne({
            problemId: id,
        });

        if (video) {

            return res.status(200).json({

                ...problem.toObject(),

                secureUrl: video.secureUrl,

                thumbnailUrl: video.thumbnailUrl,

                duration: video.duration,

            });

        }

        return res.status(200).json(problem);

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};