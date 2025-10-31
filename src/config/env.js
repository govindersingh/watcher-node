import dotenv from "dotenv";
dotenv.config();

export const config = {
  mongoUri: process.env.MONGO_URI,
  telegram_api_id: parseInt(process.env.TELEGRAM_API_ID),
  telegram_api_hash: process.env.TELEGRAM_API_HASH,
  telegram_channel_id: process.env.TELEGRAM_CHANNEL_ID,
  session: process.env.SESSION || "",
  port: process.env.PORT || 3000,
  ADMIN_USER: process.env.ADMIN_USER || "admin",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
};
