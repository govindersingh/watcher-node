import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import { config } from "../config/env.js";

const apiId = parseInt(config.telegram_api_id);
const apiHash = config.telegram_api_hash;
const session = new StringSession("");

const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });

(async () => {
  await client.start({
    phoneNumber: async () => await input.text("📱 Enter your phone number: "),
    password: async () => await input.text("🔒 Enter your password (if 2FA): "),
    phoneCode: async () => await input.text("💬 Enter the code you received: "),
    onError: (err) => console.error("❌ Telegram Error:", err),
  });

  console.log("\n✅ Telegram login successful!");
  console.log("🗝️ Save this SESSION string in your .env file:");
  console.log(client.session.save());
  await client.disconnect();
})();
