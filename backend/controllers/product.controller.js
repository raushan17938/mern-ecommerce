import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // find all products
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// store in redis for future quick access

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		res.status(201).json(product);
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

import Order from "../models/order.model.js";
import axios from "axios";

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getRecommendedProducts = async (req, res) => {
	try {
		let products = [];

		if (req.user) {
			// 1. Fetch user's last 3 orders to get product IDs
			const lastOrders = await Order.find({ user: req.user._id })
				.sort({ createdAt: -1 })
				.limit(3)
				.populate("products.product");

			const boughtProducts = [];
			lastOrders.forEach((order) => {
				order.products.forEach((item) => {
					if (item.product) {
						boughtProducts.push({
							name: item.product.name,
							description: item.product.description,
							category: item.product.category
						});
					}
				});
			});

			// 2. Call Gemini if user has history
			if (boughtProducts.length > 0) {
				try {
					const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

					const prompt = `
					User has bought the following products:
					${JSON.stringify(boughtProducts, null, 2)}

					Based on this history, suggest 3 distinct search keywords or categories to find similar or complementary products.
					Return ONLY a valid JSON array of strings. Do not include markdown code blocks.
					Example: ["electronics", "running shoes", "summer wear"]
					`;

					const result = await model.generateContent(prompt);
					const response = await result.response;
					let text = response.text().trim();

					// Clean up potential markdown code blocks
					text = text.replace(/```json/g, "").replace(/```/g, "").trim();

					const keywords = JSON.parse(text);

					if (Array.isArray(keywords) && keywords.length > 0) {
						// Search for products matching these keywords in name, description, or category
						const searchQueries = keywords.map(keyword => ({
							$or: [
								{ name: { $regex: keyword, $options: "i" } },
								{ description: { $regex: keyword, $options: "i" } },
								{ category: { $regex: keyword, $options: "i" } }
							]
						}));

						// Find products matching ANY of the keywords, exclude already bought ones (optional logic, keeping simple for now)
						products = await Product.find({ $or: searchQueries }).limit(4);
					}
				} catch (error) {
					console.log("Gemini AI Service Error:", error.message);
					// Fallback to previous logic if AI service fails
				}
			}
		}

		// 3. Fallback if no user, no history, or AI service returned nothing/error
		if (products.length === 0) {
			products = await Product.aggregate([
				{
					$sample: { size: 4 },
				},
				{
					$project: {
						_id: 1,
						name: 1,
						description: 1,
						image: 1,
						price: 1,
					},
				},
			]);
		}

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}

export const getProducts = async (req, res) => {
	try {
		const { search, category, minPrice, maxPrice, sortBy } = req.query;

		let query = {};

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		if (category) {
			query.category = { $regex: category, $options: "i" };
		}

		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) query.price.$gte = Number(minPrice);
			if (maxPrice) query.price.$lte = Number(maxPrice);
		}

		let sort = {};
		if (sortBy === "price_asc") sort.price = 1;
		else if (sortBy === "price_desc") sort.price = -1;
		else sort.createdAt = -1; // Default sort by newest

		const products = await Product.find(query).sort(sort);
		res.json({ products });
	} catch (error) {
		console.log("Error in getProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
