import express from "express";

import {
    register,
    login,
    logout,
    deleteProfile,
    refreshToken,
} from "../controllers/auth.controller.js";

import userMiddleware from "../middleware/user.middleware.js";
const authRouter = express.Router();

// Register
authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", userMiddleware, logout);

authRouter.get("/check", userMiddleware, (req, res) => {
    const reply = {
        firstName: req.user.firstName,
        emailId: req.user.emailId,
        _id:req.user._id,
        role:req.user.role,
    }

    res.status(200).json({
        user: reply,
        message: "Valid User"
    });

});

// // New Route
authRouter.post("/refresh", refreshToken);

// authRouter.post("/admin/register", adminMiddleware, adminRegister);

authRouter.delete("/deleteProfile", userMiddleware, deleteProfile);

// authRouter.get("/check", userMiddleware, checkAuth);

export default authRouter;