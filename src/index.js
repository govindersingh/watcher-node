import { connectDB } from "./db/connect.js";
import { app } from "./api/server.js";
import { connectTelegram } from "./telegram/client.js";
import { startTelegramListener } from "./telegram/listener.js";
import { config } from "./config/env.js";

const startApp = async () => {
  await connectDB();
  await connectTelegram();
  await startTelegramListener();

  app.listen(config.port, () =>
    console.log(`🚀 Server running at http://localhost:${config.port}`)
  );
};

startApp();
