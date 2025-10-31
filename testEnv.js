// testEnv.js
import { config } from "./src/config/env.js";

console.log("🧭 Loaded configuration from env.js:");
console.log("-----------------------------------");
console.log("API_ID:", config.apiId);
console.log("API_HASH:", config.apiHash);
console.log("MONGO_URI:", config.mongoUri);
console.log("CHANNEL_ID:", config.channelId);
console.log("SESSION (first 10 chars):", config.session?.slice(0, 10) || "(empty)");
console.log("PORT:", config.port);
console.log("-----------------------------------");
