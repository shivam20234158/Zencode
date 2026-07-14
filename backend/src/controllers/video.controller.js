import cloudinary from "../config/cloudinary.js";
import Problem from "../models/problem.model.js";
import SolutionVideo from "../models/solutionVideo.model.js";

export const generateUploadSignature = async (req, res) => {

    try {

        const { problemId } = req.params;

        const userId = req.user._id;

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found",
            });
        }

        const timestamp = Math.round(Date.now() / 1000);

        const publicId = `codesafari/${problemId}/${userId}_${timestamp}`;

        const uploadParams = {
            timestamp,
            public_id: publicId,
        };

        const signature = cloudinary.utils.api_sign_request(
            uploadParams,
            process.env.CLOUDINARY_API_SECRET
        );

        return res.status(200).json({

            signature,

            timestamp,

            public_id: publicId,

            api_key: process.env.CLOUDINARY_API_KEY,

            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,

        });

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};

export const saveVideoMetadata = async (req, res) => {

    try {

        const {

            problemId,

            cloudinaryPublicId,

            secureUrl,

            duration,

        } = req.body;

        const userId = req.user._id;

        const cloudinaryResource =
            await cloudinary.api.resource(
                cloudinaryPublicId,
                {
                    resource_type: "video",
                }
            );

        if (!cloudinaryResource) {

            return res.status(404).json({
                message: "Video not found",
            });

        }

        const existingVideo =
            await SolutionVideo.findOne({

                problemId,

                userId,

            });

        if (existingVideo) {

            return res.status(409).json({
                message: "Video already exists",
            });

        }

        const thumbnailUrl = cloudinary.url(
            cloudinaryResource.public_id,
            {
                resource_type: "video",
                format: "jpg",
            }
        );

        const videoSolution =
            await SolutionVideo.create({

                problemId,

                userId,

                cloudinaryPublicId,

                secureUrl,

                duration:
                    cloudinaryResource.duration || duration,

                thumbnailUrl,

            });

        return res.status(201).json({

            message: "Video saved successfully",

            video: videoSolution,

        });

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};

export const deleteVideo = async (req, res) => {

    try {

        const { problemId } = req.params;
        const userId = req.user._id;

        const video =
            await SolutionVideo.findOneAndDelete({
                problemId,
                userId,
            });

        if (!video) {

            return res.status(404).json({
                message: "Video not found",
            });

        }

        await cloudinary.uploader.destroy(
            video.cloudinaryPublicId,
            {
                resource_type: "video",
                invalidate: true,
            }
        );

        return res.status(200).json({
            message: "Video deleted successfully",
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

};