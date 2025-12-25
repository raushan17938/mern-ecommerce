import express from "express";
import { login, logout, signup, refreshToken, getProfile, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { strictLimiter, passwordResetLimiter, generalLimiter, cartLimiter } from "../middleware/rateLimit.middleware.js"


const router = express.Router();

router.post("/signup", strictLimiter, signup);

router.post("/login", strictLimiter, login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

export default router;
