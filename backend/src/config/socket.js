import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

let io = null;

// Parse cookie header string into an object
const parseCookies = (cookieString) => {
    if (!cookieString) return {};
    return Object.fromEntries(
        cookieString.split(";").map((c) => {
            const [key, ...val] = c.trim().split("=");
            return [key, decodeURIComponent(val.join("="))];
        })
    );
};

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });

    // Authenticate socket connections via JWT cookie
    io.use(async (socket, next) => {
        try {
            const cookieHeader = socket.handshake.headers.cookie;
            const cookies = parseCookies(cookieHeader);
            const token = cookies.accessToken || socket.handshake.auth?.token;

            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }

            const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(payload._id).select("-password");

            if (!user) {
                return next(new Error("Authentication error: User not found"));
            }

            socket.user = user;
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid or expired token"));
        }
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized.");
    }
    return io;
};
