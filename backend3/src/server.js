import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./modules/admin/admin.routes.js";
import newsRoutes from "./modules/news/news.routes.js";
import { sequelize } from "./config/database.js";

dotenv.config();

const app = express();

/* ---------------- Middleware ---------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
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
  res.status(200).json({ status: "ok" });
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

(async () => {
  try {
    // Import models ONLY after DB init
    await sequelize.authenticate();
    console.log("✅ Sequelize DB connected");

    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync();
      console.log("✅ DB synced (DEV MODE)");
    }

    app.listen(PORT, () => {
      console.log(`✅ Backend server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
