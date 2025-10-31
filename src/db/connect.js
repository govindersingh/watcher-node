import mongoose from "mongoose";
import { config } from "../config/env.js";

export const connectDB = async () => {
  try {
    if (!config.mongoUri) throw new Error("Missing MONGO_URI in .env");

    console.log("🕓 Connecting to MongoDB...");
    await mongoose.connect(config.mongoUri);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }

  mongoose.connection.on("error", (err) => {
    console.error("🚨 MongoDB error:", err.message);
  });
};
