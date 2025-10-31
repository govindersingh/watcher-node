import axios from "axios";
import CryptoJS from "crypto-js";
import { GrowwToken } from "../db/models/GrowwToken.js";
import { config } from "../config/env.js";

/**
 * ✅ Generate checksum (HMAC-SHA256)
 */
function generateChecksum(secret, timestamp) {
  return CryptoJS.HmacSHA256(timestamp, secret).toString(CryptoJS.enc.Hex);
}

/**
 * 🔐 Create a new Groww access token and store it
 */
export async function createGrowwAccessToken() {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const checksum = generateChecksum(config.GROWW_API_SECRET, timestamp);

    const headers = {
      Authorization: `Bearer ${config.GROWW_API_KEY}`,
      "Content-Type": "application/json",
    };

    const body = {
      key_type: "approval",
      checksum,
      timestamp,
    };

    const { data } = await axios.post(
      `${config.GROWW_BASE_URL}/token/api/access`,
      body,
      { headers }
    );

    // Purge old token
    await GrowwToken.deleteMany({});

    const tokenDoc = await GrowwToken.create({
      token: data.token,
      tokenRefId: data.tokenRefId,
      sessionName: data.sessionName,
      expiry: new Date(data.expiry),
      isActive: data.isActive,
    });

    console.log("🔐 Groww access token created successfully!");
    return tokenDoc;
  } catch (err) {
    console.error("❌ Error generating Groww token:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * ♻️ Get valid token (refresh if expired)
 */
export async function getGrowwAccessToken() {
  const existing = await GrowwToken.findOne().sort({ created_at: -1 }).lean();

  if (existing) {
    const now = new Date();
    const expiry = new Date(existing.expiry);

    if (existing.isActive && expiry > now) {
      // ✅ Token valid
      return existing.token;
    }

    console.log("⚠️ Groww token expired or inactive, regenerating...");
  } else {
    console.log("⚠️ No Groww token found, creating new...");
  }

  const newToken = await createGrowwAccessToken();
  return newToken.token;
}
