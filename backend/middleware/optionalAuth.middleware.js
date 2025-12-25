import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                const user = await User.findById(decoded.userId).select("-password");
                if (user) {
                    req.user = user;
                }
            } catch (error) {
                // Token invalid or expired, just proceed without user
                console.log("Optional auth token error:", error.message);
            }
        }
        next();
    } catch (error) {
        console.log("Error in optionalAuth middleware", error.message);
        next();
    }
};
