import mongoose from "mongoose";

const fraudLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        transactionAmount: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        details: {
            type: String, // Optional: Store JSON string of cart items or other details
        },
    },
    { timestamps: true }
);

const FraudLog = mongoose.model("FraudLog", fraudLogSchema);

export default FraudLog;
