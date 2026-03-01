import Field from "../models/Field.js";
import { updateFieldStage } from "../utils/lifecycle.utils.js";

/* =========================================
   YIELD SCORE CALCULATION
========================================= */
const calculateYieldScore = (field) => {
  let score = 80;

  const criticalCount =
    field.irrigationLogs?.filter((l) => l.wasCritical).length || 0;

  if (criticalCount > 3) score -= 15;

  if (field.stage === "Growth") score += 5;
  if (field.stage === "Harvest") score += 10;

  if (field.fertilizerLogs?.length > 0) score += 5;

  return Math.max(40, Math.min(100, score));
};

/* =========================================
   GET IRRIGATION ADVICE
========================================= */
export const getIrrigationAdvice = (req, res) => {
  try {
    const { moisture, stage, temperature, rainExpected } = req.body;

    let status = "No Irrigation Needed";
    let water = 0;
    let advice = [];

    if (moisture < 40) {
      status = "Irrigation Required";
      water = 30;
      advice.push("Soil moisture is very low.");
    } else if (moisture < 60) {
      status = "Moderate Irrigation";
      water = 18;
      advice.push("Soil moisture is moderate.");
    } else {
      advice.push("Soil moisture is sufficient.");
    }

    if (stage === "Growth") advice.push("Growth stage — higher water demand.");

    if (stage === "Harvest") {
      water = 8;
      advice.push("Near harvest — reduce irrigation.");
    }

    if (rainExpected) {
      status = "Delay Irrigation";
      water = 0;
      advice.push("Rain expected — irrigation delayed.");
    }

    return res.json({ status, water, advice });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate irrigation advice" });
  }
};

/* =========================================
   LOG IRRIGATION
========================================= */
export const logIrrigation = async (req, res) => {
  try {
    const fieldId = req.params.id;
    const { amount } = req.body;

    const field = await Field.findById(fieldId);
    if (!field) return res.status(404).json({ message: "Field not found" });

    const today = new Date();

    field.irrigationLogs.push({
      amount,
      date: today,
      wasCritical: amount >= 25,
    });

    // 🔥 Auto predict next irrigation
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

    // 🌾 Update yield score
    field.yieldScore = calculateYieldScore(field);

    await field.save();

    res.json({ message: "Irrigation logged", field });
  } catch (error) {
    res.status(500).json({ message: "Failed to log irrigation" });
  }
};

/* =========================================
   LOG FERTILIZER
========================================= */
export const logFertilizer = async (req, res) => {
  try {
    const fieldId = req.params.id;
    const { type } = req.body;

    const field = await Field.findById(fieldId);
    if (!field) return res.status(404).json({ message: "Field not found" });

    field.fertilizerLogs.push({
      type: type || "General",
      date: new Date(),
    });

    // 🌾 Update yield
    field.yieldScore = calculateYieldScore(field);

    await field.save();

    res.json({ message: "Fertilizer logged", field });
  } catch (error) {
    res.status(500).json({ message: "Failed to log fertilizer" });
  }
};

/* =========================================
   MARK HARVEST COMPLETE
========================================= */
export const markHarvestComplete = async (req, res) => {
  try {
    const fieldId = req.params.id;

    const field = await Field.findById(fieldId);
    if (!field) return res.status(404).json({ message: "Field not found" });

    field.stage = "Harvest";
    field.harvestDate = new Date();
    field.yieldScore = calculateYieldScore(field);

    await field.save();

    res.json({ message: "Harvest completed", field });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark harvest" });
  }
};