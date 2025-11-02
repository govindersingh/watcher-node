import { client } from "./client.js";
import { NewMessage } from "telegram/events/index.js";
// import Message from "../db/models/Message.js";
import { parseMessage } from "../utils/parser.js";

export const startTelegramListener = async () => {
  await client.connect();
  console.log("👂 Listening for new Telegram messages...");

  client.addEventHandler(async (event) => {
    const text = event.message?.message;
    if (!text) return;

    const parsed = parseMessage(text);
    if (!parsed) return;

     console.log(`🚀 Parsed Signal: ${parsed.symbol} | ${parsed.action}`);

    try {
      await handleTrade(parsed.symbol, parsed.action);
      // await Message.create({ ...parsed, raw: text });
    } catch (err) {
      console.error(`❌ Trade failed for ${parsed.symbol}:`, err.message);
    }
  }, new NewMessage({}));
};
