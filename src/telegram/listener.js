import { client } from "./client.js";
import { NewMessage } from "telegram/events/index.js";
import { Message } from "../db/models/Message.js";
import { parseMessage } from "../utils/parser.js";

export const startTelegramListener = async () => {
  await client.connect();
  console.log("👂 Listening for new Telegram messages...");

  client.addEventHandler(async (event) => {
    const text = event.message?.message;
    if (!text) return;

    const parsed = parseMessage(text);

    try {
      if(parsed) {
        await Message.create({ ...parsed, raw: text });
      }
    } catch (err) {
      console.error("❌ DB insert failed:", err.message);
    }
  }, new NewMessage({}));
};
