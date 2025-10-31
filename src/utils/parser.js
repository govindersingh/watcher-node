import dayjs from "dayjs";

/**
 * Parses a Telegram message text and extracts stock name, action, and timestamp.
 * Returns null if no stock match found.
 *
 * @param {string} text - The raw Telegram message
 * @returns {object|null} - Parsed { symbol, action, timestamp } or null
 */
export function parseMessage(text) {
  if (!text || typeof text !== "string") return null;

  const trimmed = text.trim();
  const ts = dayjs().format("YYYY-MM-DD HH:mm:ss");

  // --- Primary pattern for messages like "Book Profit in: BAJAJ-AUTO25NOVFUT"
  const pattern = /Book\s*(?:Partial\s*)?Profit\s*in[:：]?\s*([A-Z0-9\-_]+)/i;
  let match = trimmed.match(pattern);

  // --- If no match, normalize stylized Unicode characters
  if (!match) {
    const normalized = trimmed
      .replace(/𝗕/g, "B")
      .replace(/𝗼/g, "o")
      .replace(/𝗸/g, "k")
      .replace(/𝗣/g, "P")
      .replace(/𝗿/g, "r")
      .replace(/𝗳/g, "f")
      .replace(/𝗶/g, "i")
      .replace(/𝘁/g, "t")
      .replace(/𝗻/g, "n");

    match = normalized.match(pattern);
  }

  if (match) {
    const symbol = match[1].toUpperCase();
    const action = "SELL";

    return { symbol, action, timestamp: ts };
  }

  console.log(`⚠️ No stock found in: ${text.slice(0, 60)}`);
  return null;
}
