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
} from "../controllers/field.controller.js";

const router = express.Router();

/* CREATE FIELD */
router.post("/", auth, createField);

/* GET ALL FIELDS */
router.get("/", auth, getFields);

/* GET SINGLE FIELD (For lifecycle progress) */
router.get("/:id", auth, getFieldById);

/* UPDATE FIELD */
router.put("/:id", auth, updateField);

/* DELETE FIELD */
router.delete("/:id", auth, deleteField);
router.post("/:id/irrigate", auth, logIrrigation);
router.post("/:id/fertilize", auth, logFertilizer);
export default router;