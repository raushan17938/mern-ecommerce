import Order from "../models/order.model.js";

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email").populate("products.product", "name image price");
        res.json(orders);
    } catch (error) {
        console.log("Error in getAllOrders controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        console.log("Error in updateOrderStatus controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("products.product");
        res.json(orders);
    } catch (error) {
        console.log("Error in getMyOrders controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check if order belongs to user
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to cancel this order" });
        }

        // Only allow cancellation if status is Pending or Processing
        if (order.status !== "Pending" && order.status !== "Processing") {
            return res.status(400).json({ message: "Cannot cancel order in current status" });
        }

        order.status = "Cancelled";
        await order.save();

        res.json(order);
    } catch (error) {
        console.log("Error in cancelOrder controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
