import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { config } from "../config/env.js";

const session = new StringSession(config.session);

export const client = new TelegramClient(session, config.telegram_api_id, config.telegram_api_hash, {
  connectionRetries: 5,
});

export const connectTelegram = async () => {
  await client.connect();
  if (!client.connected) {
    console.log("🔑 Logging into Telegram...");
    await client.start({
      phoneNumber: async () => prompt("Enter phone number: "),
      password: async () => prompt("Enter password: "),
      phoneCode: async () => prompt("Enter code: "),
      onError: (err) => console.error("Telegram Error:", err),
    });
    const newSession = client.session.save();
    console.log("🗝️ Save this SESSION string in .env:\n", newSession);
  }
  console.log("✅ Telegram connected successfully!");
};
