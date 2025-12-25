import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import FraudLog from "../models/fraudLog.model.js";
import { stripe } from "../lib/stripe.js";
import axios from "axios";


import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode, shippingAddress } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		// AI Fraud Detection Check
		try {
			// Fetch user's order count for advanced fraud detection
			const orderCount = await Order.countDocuments({ user: req.user._id });

			// Simulate device check (in a real app, this would come from headers/cookies)
			// For demo: Randomly flag as new device (1) or known device (0)
			// const isNewDevice = Math.random() > 0.8 ? 1 : 0; 
			const isNewDevice = 0; // Assume known device for now to allow testing "Loyal User" scenario

			const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

			const prompt = `
			Analyze this transaction for potential fraud.
			User Order Count: ${orderCount}
			Is New Device: ${isNewDevice ? "Yes" : "No"}
			Transaction Amount: $${totalAmount / 100}

			Fraud Rules:
			- High amount (>$1000) with new device is suspicious.
			- Very high amount (>$5000) is always suspicious.
			- Low order count (0-5) with high amount is suspicious.
			- Otherwise likely safe.

			Return ONLY a JSON object: { "is_fraud": boolean, "reason": "short explanation" }
			Do not use markdown.
			`;

			const result = await model.generateContent(prompt);
			const response = await result.response;
			let text = response.text().trim();
			text = text.replace(/```json/g, "").replace(/```/g, "").trim();

			const analysis = JSON.parse(text);

			if (analysis.is_fraud) {
				// Log the fraud attempt
				await FraudLog.create({
					userId: req.user._id,
					transactionAmount: totalAmount / 100,
					reason: analysis.reason || "AI Flagged - High Risk",
					details: JSON.stringify({
						products: products.map((p) => ({ id: p._id, name: p.name, price: p.price, quantity: p.quantity })),
						ai_context: { orderCount, isNewDevice }
					}),
				});

				console.log("Transaction flagged as potential fraud:", analysis.reason);
			}
		} catch (aiError) {
			console.error("Error calling AI service:", aiError.message);
			// Optional: Decide whether to block or allow if AI service is down. 
			// For now, we'll log it and proceed (fail open) or block (fail closed).
			// Let's proceed but log the error.
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
					{
						coupon: await createStripeCoupon(coupon.discountPercentage),
					},
				]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
				shippingAddress: JSON.stringify(shippingAddress),
			},
		});

		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}
		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{
						isActive: false,
					}
				);
			}

			// create a new Order
			const products = JSON.parse(session.metadata.products);
			const shippingAddress = JSON.parse(session.metadata.shippingAddress);

			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100, // convert from cents to dollars,
				stripeSessionId: sessionId,
				shippingAddress: shippingAddress,
			});

			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}
