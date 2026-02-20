import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import fieldRoutes from "./routes/field.routes.js";
import readingRoutes from "./routes/reading.routes.js";
import soilRoutes from "./routes/soil.routes.js";
import irrigationRoutes from "./routes/irrigation.routes.js";
import diseaseRoutes from "./routes/disease.routes.js";
import marketRoutes from "./routes/market.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/soil", soilRoutes);
app.use("/api/irrigation", irrigationRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/market", marketRoutes);

app.get("/", (req, res) => {
  res.send("AgroSense AI Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});