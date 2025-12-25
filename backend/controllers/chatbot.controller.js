import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chat = async (req, res) => {
    try {
        const { message, userId } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(200).json({
                response: "I'm sorry, my brain (API Key) is missing. Please tell the admin to set GEMINI_API_KEY in the backend .env file.",
            });
        }

        // 1. Fetch User Context (if logged in)
        let userContext = "User is a guest.";
        if (userId) {
            const user = await User.findById(userId).populate("cartItems.product");
            if (user) {
                const cartSummary = user.cartItems
                    .filter(item => item.product) // Filter out items where product is null
                    .map(item =>
                        `${item.quantity}x ${item.product.name} (₹${item.product.price})`
                    ).join(", ") || "Empty";

                // Fetch recent orders
                const orders = await Order.find({ user: userId })
                    .sort({ createdAt: -1 })
                    .limit(3)
                    .populate("products.product");

                const orderSummary = orders.map(order =>
                    `Order #${order._id.toString().slice(-6)}: ${order.status} (₹${order.totalAmount})`
                ).join("; ") || "No recent orders";

                userContext = `
				User Name: ${user.name}
				Cart: ${cartSummary}
				Recent Orders: ${orderSummary}
				`;
            }
        }

        // 2. Fetch Product Knowledge (Top 5 featured or random products to give context)
        const products = await Product.find({}).limit(5);
        const productContext = products.map(p =>
            `- ${p.name} (₹${p.price}): ${p.description.slice(0, 50)}...`
        ).join("\n");

        // 3. Construct Dynamic Prompt
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const systemContext = `
        You are Nova, a personal shopping assistant for SecureShop.
        
        ${userContext}

        Store Highlights:
        ${productContext}

        Your goal is to help the user based on their specific context.
        - If they ask about their cart, tell them what's inside.
        - If they ask about orders, check their recent order status.
        - If they ask for recommendations, suggest products from the store.
        - Be friendly, concise, and use emojis.
        - IMPORTANT: ALWAYS display prices in Indian Rupees (₹). Never use Dollars ($).
        - Use nicely formatted Markdown (bold, lists) for readability.
        `;

        const prompt = `${systemContext}\n\nUser: ${message}\nNova:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error("Error in chatbot:", error);
        res.status(500).json({ error: "Failed to generate response", details: error.message });
    }
};
