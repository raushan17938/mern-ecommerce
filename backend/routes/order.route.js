import express from "express";
import { getAllOrders, updateOrderStatus, getMyOrders, cancelOrder } from "../controllers/order.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllOrders);
router.get("/my-orders", protectRoute, getMyOrders);
router.patch("/:id/status", protectRoute, adminRoute, updateOrderStatus);
router.post("/:id/cancel", protectRoute, cancelOrder);

export default router;
