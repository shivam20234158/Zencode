import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

export const generateAccessToken = (user) => {

    return jwt.sign(
        {
            _id: user._id,
            emailId: user.emailId,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "15m",
        }
    );

};

export const generateRefreshToken = (user) => {

    return jwt.sign(
        {
            _id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d",
        }
    );

};

export const setCookies = (
    res,
    accessToken,
    refreshToken
) => {

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

};

export const storeRefreshToken = async (userId, refreshToken) => {

    await redisClient.set(
        `refresh_token:${userId}`,
        refreshToken,
        "EX",
        7 * 24 * 60 * 60
    );

};

export const getStoredRefreshToken = async (userId) => {
    return await redisClient.get(`refresh_token:${userId}`);
};

// Jab website deploy hogi, tab

// NODE_ENV=production

// hoga.

// Us time automatically

// secure = true

// ho jayega aur cookies sirf HTTPS par bheji jayengi.

// Agar

// NODE_ENV=development

// to

// secure = false

// Cookies HTTP par bhi chalengi (localhost ke liye sahi hai).