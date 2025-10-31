import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  raw: { type: String },
});

export const Message = mongoose.model("Message", MessageSchema);
