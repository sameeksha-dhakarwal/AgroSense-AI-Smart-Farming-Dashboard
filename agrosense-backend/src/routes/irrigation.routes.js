import express from "express";
import { getIrrigationAdvice } from "../controllers/irrigation.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.post("/recommend", getIrrigationAdvice);

export default router;
