import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./modules/admin/admin.routes.js";
import newsRoutes from "./modules/news/news.routes.js";
import { sequelize } from "./config/database.js";

dotenv.config();

const app = express();

/* ---------------- Global Middleware ---------------- */

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request timeout protection (prevents hanging → 504)
app.use((req, res, next) => {
  res.setTimeout(60_000, () => {
    if (!res.headersSent) {
      res.status(503).json({ message: "Request timeout" });
    }
  });
  next();
});

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

/* ---------------- Routes ---------------- */

app.use("/api/admin", adminRoutes);
app.use("/api/news", newsRoutes);

/* ---------------- Health Check ---------------- */

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ---------------- Error Handler ---------------- */

app.use((err, req, res, _next) => {
  console.error("SERVER ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ---------------- Bootstrap ---------------- */

const PORT = process.env.PORT || 5010;
let server;

(async () => {
  try {
    // Ensure DB is reachable before listening
    await sequelize.authenticate();
    console.log("✅ Sequelize DB connected");

    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync();
      console.log("✅ DB synced (DEV MODE)");
    }

    server = app.listen(PORT, () => {
      console.log(`✅ Backend server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();

/* ---------------- Graceful Shutdown ---------------- */

const shutdown = async () => {
  console.log("🛑 Graceful shutdown initiated...");
  try {
    if (server) {
      server.close(() => {
        console.log("✅ HTTP server closed");
      });
    }
    await sequelize.close();
    console.log("✅ DB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Shutdown error:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
