import express from "express";
import auth from "../middleware/auth.js";
import {
  createField,
  getFields,
  updateField,
  deleteField,
} from "../controllers/field.controller.js";

const router = express.Router();

router.post("/", auth, createField);
router.get("/", auth, getFields);
router.put("/:id", auth, updateField);
router.delete("/:id", auth, deleteField);

export default router;
