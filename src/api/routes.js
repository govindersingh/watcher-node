import express from "express";
import { Message } from "../db/models/Message.js";

const router = express.Router();

router.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ _id: -1 }).limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
