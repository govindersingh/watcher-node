import express from "express";
import routes from "./routes.js";

export const app = express();

app.use(express.json());
app.use(routes);

app.get("/", (req, res) => {
  res.send("<h2>✅ Telegram Watcher is running</h2>");
});
