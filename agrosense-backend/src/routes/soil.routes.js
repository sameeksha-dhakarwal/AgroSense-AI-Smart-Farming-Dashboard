import express from "express";
import { analyzeSoil } from "../controllers/soil.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.post("/analyze", analyzeSoil);

export default router;
