import Field from "../models/Field.js";
import { updateFieldStage } from "../utils/lifecycle.utils.js";

/* =========================================
   GET IRRIGATION ADVICE (Smart Logic)
========================================= */
export const getIrrigationAdvice = (req, res) => {
  try {
    const { moisture, stage, temperature, rainExpected } = req.body;

    let status = "No Irrigation Needed";
    let water = "0 mm";
    let advice = [];

    // 🌡 Moisture Logic
    if (moisture < 40) {
      status = "Irrigation Required";
      water = "25–30 mm";
      advice.push("Soil moisture is very low.");
    } 
    else if (moisture < 60) {
      status = "Moderate Irrigation";
      water = "10–15 mm";
      advice.push("Soil moisture is moderate.");
    } 
    else {
      advice.push("Soil moisture is sufficient.");
    }

    // 🌱 Growth Stage Impact
    if (stage === "Growth") {
      advice.push("Crop is in growth stage — higher water demand.");
    }

    if (stage === "Harvest") {
      advice.push("Crop is near harvest — reduce irrigation.");
      water = "5–8 mm";
    }

    // 🌧 Rain Override
    if (rainExpected) {
      status = "Delay Irrigation";
      water = "0 mm";
      advice.push("Rain is expected — irrigation can be delayed.");
    }

    return res.json({
      status,
      water,
      advice,
    });

  } catch (error) {
    console.error("Advice Error:", error);
    res.status(500).json({ message: "Failed to generate irrigation advice" });
  }
};


/* =========================================
   LOG IRRIGATION (Manual Button)
========================================= */
export const logIrrigation = async (req, res) => {
  try {
    const { fieldId, amount } = req.body;

    const field = await Field.findById(fieldId);

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    field.irrigationLogs.push({
      amount: amount || 0,
      date: new Date(),
    });

    // Update lifecycle stage automatically
    updateFieldStage(field);

    await field.save();

    return res.json({
      message: "Irrigation logged successfully",
      field,
    });

  } catch (error) {
    console.error("Log Irrigation Error:", error);
    return res.status(500).json({
      message: "Failed to log irrigation",
    });
  }
};


/* =========================================
   LOG FERTILIZER
========================================= */
export const logFertilizer = async (req, res) => {
  try {
    const { fieldId, type } = req.body;

    const field = await Field.findById(fieldId);

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    field.fertilizerLogs.push({
      type: type || "General",
      date: new Date(),
    });

    await field.save();

    return res.json({
      message: "Fertilizer logged successfully",
      field,
    });

  } catch (error) {
    console.error("Log Fertilizer Error:", error);
    return res.status(500).json({
      message: "Failed to log fertilizer",
    });
  }
};


/* =========================================
   MARK HARVEST COMPLETE
========================================= */
export const markHarvestComplete = async (req, res) => {
  try {
    const { fieldId } = req.body;

    const field = await Field.findById(fieldId);

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    field.stage = "Harvest";
    field.harvestDate = new Date();

    await field.save();

    return res.json({
      message: "Harvest marked as complete",
      field,
    });

  } catch (error) {
    console.error("Harvest Error:", error);
    return res.status(500).json({
      message: "Failed to mark harvest",
    });
  }
};