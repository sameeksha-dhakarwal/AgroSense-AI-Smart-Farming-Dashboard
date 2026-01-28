import express from "express";
import {
  addReading,
  getLatestReading,
  getWeeklyReadings,
} from "../controllers/reading.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", addReading);
router.get("/latest/:fieldId", getLatestReading);
router.get("/weekly/:fieldId", getWeeklyReadings);

export default router;
