// src/db/messageService.js
import { Message } from "../db/models/Message.js";

export async function getAllMessages() {
  try {
    return await Message.find().sort({ _id: -1 }).limit(50).lean();
  } catch (err) {
    console.error("❌ Failed to fetch messages:", err.message);
    return [];
  }
}
