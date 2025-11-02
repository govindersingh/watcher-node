import express from "express";
const router = express.Router();
import { getOrders } from "../groww/service.js";

// Example: health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// get all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;
