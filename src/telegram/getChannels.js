// src/telegram/getChannels.js
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { config } from "../config/env.js";

export async function getChannels() {
  console.log("🔄 Fetching Telegram channels...");

  if (!config.session || !config.telegram_api_id || !config.telegram_api_hash) {
    throw new Error("❌ Missing Telegram credentials or session in env.js");
  }

  const client = new TelegramClient(
    new StringSession(config.session),
    config.telegram_api_id,
    config.telegram_api_hash,
    { connectionRetries: 5 }
  );

  await client.start();
  console.log("✅ Telegram connected!");

  const dialogs = await client.getDialogs();
  const channels = dialogs
    .filter(
      (dialog) =>
        dialog.isChannel ||
        (dialog.entity.className === "Channel" ||
          dialog.entity.className === "Chat")
    )
    .map((d) => ({
      name: d.name,
      id: d.id,
      type: d.entity.className,
      accessHash: d.entity.accessHash,
    }));

  console.log(`📋 Found ${channels.length} channels/groups:\n`);
  channels.forEach((ch, i) => {
    console.log(`${i + 1}. ${ch.name} [${ch.id}] (${ch.type})`);
  });

  await client.disconnect();
  console.log("\n👋 Done! Connection closed.");

  return channels;
}

// Run directly if called via `node src/telegram/getChannels.js`
if (process.argv[1].includes("getChannels.js")) {
  getChannels().catch((err) => {
    console.error("❌ Failed to get channels:", err.message);
    process.exit(1);
  });
}
