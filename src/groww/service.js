import axios from "axios";
import { config } from "../config/env.js";

const api = axios.create({
  baseURL: config.GROWW_BASE_URL,
  headers: {
    "Accept": "application/json",
    "Authorization": `Bearer ${config.GROWW_ACCESS_TOKEN}`,
    "X-API-VERSION" : "1.0"
  },
  timeout: 10000
});

// Fetch all open orders
export async function getOrders() {
  try {
    const response = await api.get(`/order/list`);
    if (!response.data || !Array.isArray(response.data)) throw new Error("Invalid Groww response");
    return response.data;
  } catch (err) {
    console.error("❌ Groww getOrders error:", err.message);
    throw err;
  }
}

// Place Buy/Sell Order
export async function placeOrder(symbol, side, quantity = 1) {
  try {
    const payload = {
      symbol,
      side, // 'BUY' or 'SELL'
      quantity,
      orderType: "MARKET"
    };
    
    const response = await api.post(`/order/place`, payload);
    console.log(`✅ ${side} order placed for ${symbol}`);
    return response.data;
  } catch (err) {
    console.error(`❌ Failed to place ${side} order for ${symbol}:`, err.message);
    throw err;
  }
}
