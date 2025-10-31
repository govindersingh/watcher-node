import express from "express";
const router = express.Router();
import { getHoldings } from "../groww/service.js";

// Example: health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// get all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await getHoldings();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
