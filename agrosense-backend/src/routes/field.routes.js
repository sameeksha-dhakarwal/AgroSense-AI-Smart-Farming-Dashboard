import express from "express";
import auth from "../middleware/auth.js";
import {
  createField,
  getFields,
  getFieldById,
  updateField,
  deleteField,
  logIrrigation,
  logFertilizer,
  getWeeklySoilMoisture
} from "../controllers/field.controller.js";

const router = express.Router();

/* =========================
   CREATE FIELD
========================= */
router.post("/", auth, createField);

/* =========================
   GET ALL FIELDS
========================= */
router.get("/", auth, getFields);

/* =========================
   WEEKLY SOIL MOISTURE
   ⚠️ MUST COME BEFORE /:id
========================= */
router.get("/:id/weekly-moisture", auth, getWeeklySoilMoisture);

/* =========================
   GET SINGLE FIELD
========================= */
router.get("/:id", auth, getFieldById);

/* =========================
   UPDATE FIELD
========================= */
router.put("/:id", auth, updateField);

/* =========================
   DELETE FIELD
========================= */
router.delete("/:id", auth, deleteField);

/* =========================
   IRRIGATION & FERTILIZER
========================= */
router.post("/:id/irrigate", auth, logIrrigation);
router.post("/:id/fertilize", auth, logFertilizer);

export default router;