// src/api/server.js
import express from "express";
import cors from "cors";
import routes from "./routes.js";

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api", routes);

// Default route (home)
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Telegram Watcher Running</h2>
  `);
});
