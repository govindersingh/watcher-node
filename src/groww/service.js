import { growwClient } from "./client.js";

/**
 * Fetch current holdings
 */
export async function getHoldings() {
  const { data } = await growwClient.get("/orders");
  return data;
}

/**
 * Place an order
 */
export async function placeOrder(symbol, side, quantity = 1) {
  const payload = {
    symbol,
    transactionType: side, // BUY / SELL
    quantity,
    orderType: "MARKET",
  };

  const { data } = await growwClient.post("/orders", payload);
  console.log(`🟢 Groww order placed: ${symbol} (${side})`);
  return data;
}
