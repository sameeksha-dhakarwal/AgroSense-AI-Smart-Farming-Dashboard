import express from "express";
import {
  createField,
  getFields,
  updateField,
  deleteField,
} from "../controllers/field.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createField);
router.get("/", getFields);
router.put("/:id", updateField);
router.delete("/:id", deleteField);

export default router;
