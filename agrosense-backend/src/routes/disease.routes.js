import express from "express";
import multer from "multer";
import { scanDisease, getHistory } from "../controllers/disease.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Protect all disease routes
router.use(protect);

// Routes
router.post("/scan", upload.single("image"), scanDisease);
router.get("/history", getHistory);

export default router;