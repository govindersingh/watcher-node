export const parseMessage = (text = "") => {
  text = text.trim();
  let action = "INFO";
  let symbol = "UNKNOWN";

  // Detect action
  if (/buy/i.test(text)) action = "BUY";
  else if (/sell/i.test(text)) action = "SELL";
  else if (/book\s+profit/i.test(text)) action = "SELL";

  // Extract symbol (e.g. ORIENTTECH, BAJAJ-AUTO25NOVFUT)
  const match = text.match(/(?:in|for)[:：]?\s*([A-Z0-9\-_]+)/i);
  if (match) symbol = match[1].toUpperCase();

  return { symbol, action };
};
