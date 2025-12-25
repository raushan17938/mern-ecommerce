import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.UPSTASH_REDIS_URL;
let client;

if (url) {
    client = new Redis(url, {
        family: 4,   // Forces IPv4 (Fixes network resolution)
        tls: {},     // 👈 THIS IS MISSING. Required for Upstash to allow connection.
        maxRetriesPerRequest: null, // Good practice: disables the "20 retries" crash if server is slow
    });

    client.on("error", (err) => {
        // Only log critical connection errors
        console.error("[ioredis] Connection Error:", err.message);
    });

    client.on("connect", () => {
        console.log("✅ [ioredis] Connected to Redis successfully!");
    });

    client.on("ready", () => {
        console.log("🚀 [ioredis] Client is ready to use.");
    });
} else {
    console.warn("⚠️ [ioredis] UPSTASH_REDIS_URL not set — using no-op fallback");
    client = {
        get: async () => null,
        set: async () => null,
        del: async () => null,
        on: () => {},
        quit: async () => {},
    };
}

export const redis = client;