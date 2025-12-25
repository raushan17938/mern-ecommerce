import { rateLimit } from "express-rate-limit";

// 1. Strict Limiter: For Login, Register, Payments
// Reason: Prevents brute-force attacks and card testing.
export const strictLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 Minutes
    limit: 100, 
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many security attempts, please try again after 15 minutes."
    }
});

// 2. Super Strict Limiter: For Password Reset / OTP
// Reason: These endpoints send emails/SMS. We must prevent spamming.
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hour
    limit: 3, // Only 3 attempts per hour
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many password reset requests. Please try again in an hour."
    }
});

// 3. General Limiter: For Products, Search, Analytics
// Reason: Allows normal browsing (high traffic) but stops scrapers.
export const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 Minute
    limit: 6, 
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please slow down."
    }
});

// 4. Cart Limiter: Operational
// Reason: Prevents bots from "hoarding" items by adding to cart 1000 times.
export const cartLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 Minute
    limit: 50,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many cart operations."
    }
});