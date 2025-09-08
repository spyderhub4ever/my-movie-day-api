import http from "http";
import app from "./app";
import env from "./config/env";
import connectDB from "./config/db";

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    process.on("SIGINT", () => {
      console.log("Shutting down...");
      server.close(() => {
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
