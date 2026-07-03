import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const userMiddleware = async (req, res, next) => {

    try {

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const payload = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(payload._id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid or Expired Access Token"
        });

    }

};

export default userMiddleware;