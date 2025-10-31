import { client } from "./client.js";
import { config } from "../config/env.js";
import { NewMessage } from "telegram/events/index.js";
import { parseMessage } from "../utils/parser.js";
import { Message } from "../db/models/Message.js";

export const startTelegramListener = async () => {
  await client.connect();
  console.log("👂 Listening for new Telegram messages...");

  client.addEventHandler(async (event) => {
    const text = event.message?.message?.trim();
    if (!text) return;

    const parsed = parseMessage(text);
    // const doc = new Message({ ...parsed, raw: text });

    try {
    //   await doc.save();
      console.log(`💾 Saved: ${parsed.symbol} (${parsed.action})`);
    } catch (err) {
      console.error("❌ DB insert failed:", err.message);
    }
  }, new NewMessage({}));
};
