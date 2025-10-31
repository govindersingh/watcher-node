import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  raw: { type: String },
});

const Message = mongoose.model("Message", MessageSchema);
export default Message;