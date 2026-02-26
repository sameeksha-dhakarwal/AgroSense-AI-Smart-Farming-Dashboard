import express from "express";
import {
  logIrrigation,
  getIrrigationAdvice,
  logFertilizer,
  markHarvestComplete,
} from "../controllers/irrigation.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* Advice */
router.post("/advice", protect, getIrrigationAdvice);

/* Logging */
router.post("/:id/irrigate", protect, logIrrigation);
router.post("/:id/fertilize", protect, logFertilizer);
router.post("/:id/harvest", protect, markHarvestComplete);

export default router;