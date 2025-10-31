import express from "express";
const router = express.Router();

// Example: health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Example: latest messages (if you store Telegram data)
router.get("/messages", async (req, res) => {
  try {
    // Replace this with actual Mongo query
    // e.g., const messages = await Message.find().sort({ _id: -1 }).limit(20);
    const messages = [{ symbol: "TATASTEEL", action: "BUY", timestamp: new Date() }];
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
