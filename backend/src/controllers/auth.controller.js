import User from "../models/user.model.js";
import validate from "../utils/validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

import {
    generateAccessToken,
    generateRefreshToken,
    setCookies,
    storeRefreshToken,
    getStoredRefreshToken,
} from "../utils/generateToken.js";

export const register = async (req, res) => {

    try {

        validate(req.body);

        req.body.role = "user";
        const existingUser = await User.findOne({
            emailId: req.body.emailId,
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const user = await User.create(req.body);

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);

        // Redis me baad me store karenge
        await storeRefreshToken(user._id.toString(), refreshToken);

        setCookies(
            res,
            accessToken,
            refreshToken
        );

        const reply = {

            _id: user._id,

            firstName: user.firstName,

            emailId: user.emailId,

            role: user.role,

        };

        res.status(201).json({

            user: reply,

            message: "Registered Successfully",

        });

    }
    catch (err) {

        res.status(400).json({

            message: err.message,

        });

    }

};
export const login = async (req, res) => {

    try {

        const { emailId, password } = req.body;

        if (!emailId || !password) {
            throw new Error("Invalid Credentials");
        }

        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            throw new Error("Invalid Credentials");
        }

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);

        await storeRefreshToken(
            user._id.toString(),
            refreshToken
        );

        setCookies(
            res,
            accessToken,
            refreshToken
        );

        const reply = {
            _id: user._id,
            firstName: user.firstName,
            emailId: user.emailId,
            role: user.role,
        };

        res.status(200).json({
            user: reply,
            message: "Login Successful",
        });

    }
    catch (err) {

        res.status(401).json({
            message: err.message,
        });

    }

};
export const refreshToken = async (req, res) => {

    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "No Refresh Token",
            });
        }

        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const storedToken = await getStoredRefreshToken(
            payload._id.toString()
        );

        if (!storedToken || storedToken !== refreshToken) {
            return res.status(401).json({
                message: "Invalid Refresh Token",
            });
        }

        // Latest user data fetch karo
        const user = await User.findById(payload._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Naya Access Token generate karo
        const accessToken = generateAccessToken(user);

        // Cookie set karo
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 min
        });

        return res.status(200).json({
            message: "Access Token Refreshed Successfully",
        });

    } catch (err) {

        return res.status(401).json({
            message: "Invalid or Expired Refresh Token",
        });

    }

};
export const logout = async (req, res) => {

    try {

        await redisClient.del(
            `refresh_token:${req.user._id}`
        );

        res.clearCookie("accessToken");

        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "Logout Successful"
        });

    }
    catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

};
export const deleteProfile = async (req, res) => {
    try {

        await redisClient.del(
            `refresh_token:${req.user._id}`
        );

        await User.findByIdAndDelete(req.user._id);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "Profile Deleted Successfully"
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};