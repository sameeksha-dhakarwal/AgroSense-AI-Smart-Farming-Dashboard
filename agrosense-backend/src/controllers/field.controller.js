import Field from "../models/Field.js";
import { updateFieldStage } from "../utils/lifecycle.utils.js";
import { calculateHarvestPrediction } from "../utils/harvest.utils.js";

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
      stage: "Preparation",
      stageStartDate: new Date(),
      irrigationLogs: [],
      fertilizerLogs: [],
      soilMoistureLogs: [],
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
   GET SINGLE FIELD
========================= */
export const getFieldById = async (req, res) => {
  try {
    if (!req.params.id || req.params.id === "undefined") {
      return res.status(400).json({ message: "Invalid field ID" });
    }

    const field = await Field.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    updateFieldStage(field);

    const harvestPrediction =
      calculateHarvestPrediction(field);

    await field.save();

    res.json({
      ...field.toObject(),
      harvestPrediction,
    });

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

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

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
    const field = await Field.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.json({ message: "Field deleted successfully" });
  } catch (error) {
    console.error("DELETE FIELD ERROR:", error);
    res.status(500).json({ message: "Failed to delete field" });
  }
};

/* =========================
   LOG IRRIGATION
========================= */
export const logIrrigation = async (req, res) => {
  try {
    if (!req.params.id || req.params.id === "undefined") {
      return res.status(400).json({ message: "Invalid field ID" });
    }

    const field = await Field.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    const amount = Number(req.body.amount) || 0;
    const today = new Date();

    field.irrigationLogs.push({
      date: today,
      amount,
      wasCritical: amount >= 25,
    });

    const simulatedMoisture = Math.max(
      30,
      Math.min(100, 60 + Math.random() * 20 - 10)
    );

    field.soilMoistureLogs.push({
      date: today,
      value: Math.round(simulatedMoisture),
    });

    const days =
      field.stage === "Growth"
        ? 5
        : field.stage === "Planting"
        ? 6
        : 7;

    field.nextIrrigationDate = new Date(
      today.getTime() + days * 24 * 60 * 60 * 1000
    );

    updateFieldStage(field);

    await field.save();

    res.json({ message: "Irrigation logged successfully", field });
  } catch (error) {
    console.error("IRRIGATION LOG ERROR:", error);
    res.status(500).json({ message: "Failed to log irrigation" });
  }
};

/* =========================
   LOG FERTILIZER
========================= */
export const logFertilizer = async (req, res) => {
  try {
    if (!req.params.id || req.params.id === "undefined") {
      return res.status(400).json({ message: "Invalid field ID" });
    }

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
  } catch (err) {
    console.error("FERTILIZER LOG ERROR:", err);
    res.status(500).json({ message: "Failed to log fertilizer" });
  }
};

/* =========================
   WEEKLY SOIL MOISTURE
   🔥 FIXED FOR PERSISTENCE
========================= */
export const getWeeklySoilMoisture = async (req, res) => {
  try {
    if (!req.params.id || req.params.id === "undefined") {
      return res.status(400).json({ message: "Invalid field ID" });
    }

    const field = await Field.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    // Sort newest first
    const sortedLogs = [...field.soilMoistureLogs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7)      // last 7 records
      .reverse();       // oldest → newest for graph

    res.json(sortedLogs);

  } catch (error) {
    console.error("WEEKLY MOISTURE ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch weekly soil moisture",
    });
  }
};