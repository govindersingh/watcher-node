import axios from "axios";
import { config } from "../config/env.js";

const growwApi = axios.create({
  baseURL: config.GROWW_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${config.GROWW_ACCESS_TOKEN}`,
    "X-API-VERSION" : "1.0"
  }
});

// Fetch all open orders
export async function getOrders() {
  try {
    const response = await growwApi.get(`/order/list`);
    return response.data;
  } catch (err) {
    console.error("❌ Groww getOrders error:", err.message);
    throw err;
  }
}

// Place Buy/Sell Order
export const handleTrade = async (symbol) => {
  console.log(`⚙️ Checking Groww orders for ${symbol}...`);

  try {
    // Step 1: Get all orders
    const response = await getOrders();
    if (response.status !== "SUCCESS") throw new Error("Failed to fetch orders");

    const orders = response.payload.order_list || [];

    // Step 2: Find existing order for this symbol
    const existing = orders.find(
      (o) =>
        o.trading_symbol === symbol &&
        (o.order_status === "EXECUTED" || o.order_status === "OPEN")
    );

    if (!existing) {
      console.log(`⚠️ No existing order found for ${symbol}, skipping trade.`);
      return;
    }

    // Step 3: Determine opposite side
    const oppositeSide = existing.transaction_type === "BUY" ? "SELL" : "BUY";
    console.log(`🔁 Found ${existing.transaction_type} order for ${symbol}. Placing ${oppositeSide} order...`);

    // Step 4: Place the opposite order
    const payload = {
      trading_symbol: symbol,
      quantity: existing.quantity,
      price: existing.price,
      validity: existing.validity,
      exchange: existing.exchange,
      segment: existing.segment,
      product: existing.product,
      order_type: existing.order_type,
      transaction_type: oppositeSide,
      order_reference_id: existing.groww_order_id
    };
    console.log(payload);

    const orderResponse = await growwApi.post("/order/create", payload);

    if (orderResponse.data.status !== "SUCCESS")
      throw new Error(orderResponse.data.message || "Order placement failed");

    console.log(`✅ ${oppositeSide} order placed for ${symbol}:`, orderResponse.data.payload);
  } catch (err) {
    console.error(`❌ Error handling trade for ${symbol}:`, err.data?.message || err.message);
  }
};
