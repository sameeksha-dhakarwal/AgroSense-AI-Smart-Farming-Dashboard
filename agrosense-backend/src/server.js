import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

/* Fix for ES Modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ✅ FORCE LOAD .env FROM ROOT */
dotenv.config({
  path: path.join(__dirname, "../.env"),
});

/* DEBUG */
console.log("ENV LOADED PATH:", path.join(__dirname, "../.env"));
console.log("OPENAI KEY:", process.env.OPENAI_API_KEY);

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import fieldRoutes from "./routes/field.routes.js";
import readingRoutes from "./routes/reading.routes.js";
import soilRoutes from "./routes/soil.routes.js";
// import irrigationRoutes from "./routes/irrigation.routes.js";
import diseaseRoutes from "./routes/disease.routes.js";
import marketRoutes from "./routes/market.routes.js";
import "./jobs/notification.job.js";
import irrigationRoutes from "./routes/irrigation.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import productRoutes from "./routes/product.routes.js";
import marketplaceRoutes from "./routes/marketplace.routes.js";
import aiRoutes from "./routes/ai.js";

/* Connect DB AFTER env is loaded */
connectDB();

const app = express();

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Serve uploaded images */
app.use("/uploads", express.static("uploads"));

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/soil", soilRoutes);
app.use("/api/irrigation", irrigationRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/listings", marketplaceRoutes);

/* ✅ AI ROUTE */
app.use("/api/ai", aiRoutes);

/* Root */
app.get("/", (req, res) => {
  res.send("AgroSense AI Backend Running");
});

/* Start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});