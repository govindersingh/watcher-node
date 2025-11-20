import { client } from "./client.js";
import { NewMessage } from "telegram/events/index.js";
// import Message from "../db/models/Message.js";
import { parseMessage } from "../utils/parser.js";
import { handleTrade } from "../groww/service.js";
import { ensureLoggedInAndExit } from "../univest/automation.js";

export const startTelegramListener = async () => {
  await client.connect();
  console.log("👂 Listening for new Telegram messages...");

  client.addEventHandler(async (event) => {
    const text = event.message?.message;
    if (!text) return;

    const parsed = parseMessage(text);
    if (!parsed) return;

    const result = await ensureLoggedInAndExit(parsed.symbol);
    if (!result.ok) {
      console.error("Univest automation failed:", result.error);
      // use retries / fallback
    } else {
      console.log("Univest automation success:", result.message, result.screenshot);
      // store log in Mongo
    }

    // console.log(`🚀 Parsed Signal: ${parsed.symbol}`);

    try {
      // await handleTrade(parsed.symbol);
      // await Message.create({ ...parsed, raw: text });
    } catch (err) {
      console.error(`❌ Trade failed for ${parsed.symbol}:`, err.message);
    }
  }, new NewMessage({}));
};
