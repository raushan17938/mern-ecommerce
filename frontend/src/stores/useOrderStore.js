import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useOrderStore = create((set) => ({
    orders: [],
    myOrders: [],
    loading: false,

    fetchAllOrders: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/orders");
            set({ orders: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to fetch orders");
        }
    },

    updateOrderStatus: async (id, status) => {
        set({ loading: true });
        try {
            const res = await axios.patch(`/orders/${id}/status`, { status });
            set((state) => ({
                orders: state.orders.map((order) => (order._id === id ? { ...order, status: res.data.status } : order)),
                loading: false,
            }));
            toast.success("Order status updated");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to update order status");
        }
    },
    fetchMyOrders: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/orders/my-orders");
            set({ myOrders: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to fetch orders");
        }
    },

    cancelOrder: async (orderId) => {
        set({ loading: true });
        try {
            await axios.post(`/orders/${orderId}/cancel`);
            set((state) => ({
                myOrders: state.myOrders.map((order) =>
                    order._id === orderId ? { ...order, status: "Cancelled" } : order
                ),
                loading: false,
            }));
            toast.success("Order cancelled successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to cancel order");
        }
    },
}));
