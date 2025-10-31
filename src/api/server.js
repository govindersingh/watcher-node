// src/api/server.js
import express from "express";
import cors from "cors";
import routes from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";
import basicAuth from "express-basic-auth";
import Message from "../db/models/Message.js";
import { config } from "../config/env.js";

// Proper __dirname handling for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");

const viewsDir = path.resolve(process.cwd(), "views");
app.set("views", viewsDir);
console.log("📂 Views directory:", viewsDir);

// Basic Auth middleware
const adminAuth = basicAuth({
  users: { [config.ADMIN_USER]: config.ADMIN_PASSWORD },
  challenge: true, // triggers browser login popup
});

// Mount API routes
app.use("/api", routes);

// Default route
app.get("/", (req, res) => {
  res.send("<h2>✅ Telegram Watcher Backend Running</h2>");
});

// Protected dashboard route
app.get("/dashboard", adminAuth, async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ _id: -1 }) // newest first
      .limit(50)
      .lean();

    res.render("dashboard", { messages });
  } catch (err) {
    console.error("❌ Error rendering dashboard:", err.message);
    res.status(500).send("Internal Server Error");
  }
});
