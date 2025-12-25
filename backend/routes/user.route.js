import express from "express";
import { updateProfile, updatePassword } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/profile", protectRoute, updateProfile);
router.put("/password", protectRoute, updatePassword);

export default router;
