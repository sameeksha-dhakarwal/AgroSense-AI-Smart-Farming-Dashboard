import express from "express";
import multer from "multer";
import { scanDisease } from "../controllers/disease.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.use(protect);
router.post("/scan", upload.single("image"), scanDisease);

export default router;
