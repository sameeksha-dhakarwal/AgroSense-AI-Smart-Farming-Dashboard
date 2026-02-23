import Field from "../models/Field.js";
import { updateFieldStage } from "../utils/lifecycle.utils.js";

/* =========================
   CREATE FIELD
========================= */
export const createField = async (req, res) => {
  try {
    const {
      name,
      area,
      crop,
      soilType,
      latitude,
      longitude,
      address,
    } = req.body;

    const field = await Field.create({
      name,
      area,
      crop,
      soilType,
      location: {
        latitude,
        longitude,
        address,
      },
      stage: "Preparation",        // 👈 lifecycle start
      stageStartDate: new Date(),  // 👈 lifecycle timer
      irrigationLogs: [],
      fertilizerLogs: [],
      user: req.user._id,
    });

    res.status(201).json(field);
  } catch (err) {
    console.error("CREATE FIELD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ALL FIELDS
========================= */
export const getFields = async (req, res) => {
  try {
    const fields = await Field.find({ user: req.user._id });
    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch fields" });
  }
};

/* =========================
   GET SINGLE FIELD (With Auto Stage Update)
========================= */
export const getFieldById = async (req, res) => {
  try {
    const field = await Field.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    // 🔥 Auto update lifecycle stage
    updateFieldStage(field);
    await field.save();

    res.json(field);
  } catch (error) {
    console.error("GET FIELD ERROR:", error);
    res.status(500).json({ message: "Failed to fetch field" });
  }
};

/* =========================
   UPDATE FIELD
========================= */
export const updateField = async (req, res) => {
  try {
    const {
      name,
      area,
      crop,
      soilType,
      latitude,
      longitude,
      address,
    } = req.body;

    const field = await Field.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        name,
        area,
        crop,
        soilType,
        location: {
          latitude,
          longitude,
          address,
        },
      },
      { new: true }
    );

    res.json(field);
  } catch (err) {
    console.error("UPDATE FIELD ERROR:", err);
    res.status(500).json({ message: "Failed to update field" });
  }
};

/* =========================
   DELETE FIELD
========================= */
export const deleteField = async (req, res) => {
  try {
    await Field.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    res.json({ message: "Field deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete field" });
  }
};

/* =========================
   LOG IRRIGATION
========================= */
export const logIrrigation = async (req, res) => {
  try {
    const field = await Field.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    field.irrigationLogs.push({
      date: new Date(),
      amount: req.body.amount || "Standard",
    });

    await field.save();

    res.json({ message: "Irrigation logged successfully", field });
  } catch (error) {
    res.status(500).json({ message: "Failed to log irrigation" });
  }
};

/* =========================
   LOG FERTILIZER
========================= */
export const logFertilizer = async (req, res) => {
  try {
    const field = await Field.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    field.fertilizerLogs.push({
      date: new Date(),
      type: req.body.type || "General Fertilizer",
    });

    await field.save();

    res.json({ message: "Fertilizer logged successfully", field });
  } catch (error) {
    res.status(500).json({ message: "Failed to log fertilizer" });
  }
};