import express from "express";

import {
    generateUploadSignature,
    saveVideoMetadata,
    deleteVideo,
} from "../controllers/video.controller.js";

import adminMiddleware from "../middleware/admin.middleware.js";
import userMiddleware from "../middleware/user.middleware.js";

const videoRouter = express.Router();

videoRouter.get(
    "/create/:problemId",
    userMiddleware,
    adminMiddleware,
    generateUploadSignature
);

videoRouter.post(
    "/save",
    userMiddleware,
    adminMiddleware,
    saveVideoMetadata
);

videoRouter.delete(
    "/delete/:problemId",
    userMiddleware,
    adminMiddleware,
    deleteVideo
);

export default videoRouter;