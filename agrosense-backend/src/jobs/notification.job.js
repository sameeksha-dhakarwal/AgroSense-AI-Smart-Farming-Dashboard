import cron from "node-cron";
import Field from "../models/Field.js";
import Notification from "../models/Notification.js";

/* =========================
   Daily Smart Agriculture Check
   Runs Every Day at 12:00 AM
   ========================= */
cron.schedule("0 0 * * *", async () => {
  console.log("🌾 Running daily irrigation & fertilizer check...");

  try {
    const fields = await Field.find();
    const now = new Date();

    for (const field of fields) {
      const DAY = 1000 * 60 * 60 * 24;

      /* =========================
         IRRIGATION REMINDER
         ========================= */
      const lastIrrigation =
        field.irrigationLogs?.[field.irrigationLogs.length - 1];

      const irrigationDue =
        !lastIrrigation ||
        (now - new Date(lastIrrigation.date)) / DAY > 20;

      if (irrigationDue) {
        await Notification.create({
          user: field.user,
          message: `💧 Time for irrigation in field "${field.name}"`,
          type: "irrigation",
        });
      }

      /* =========================
         FERTILIZER REMINDER (Growth Stage Only)
         ========================= */
      const lastFertilizer =
        field.fertilizerLogs?.[field.fertilizerLogs.length - 1];

      const fertilizerDue =
        field.stage === "Growth" &&
        (
          !lastFertilizer ||
          (now - new Date(lastFertilizer.date)) / DAY > 30
        );

      if (fertilizerDue) {
        await Notification.create({
          user: field.user,
          message: `🌿 Fertilizer recommended for "${field.name}" (Growth stage)`,
          type: "fertilizer",
        });
      }

      /* =========================
         HARVEST STAGE NOTICE
         ========================= */
      if (field.stage === "Harvest") {
        await Notification.create({
          user: field.user,
          message: `🌾 Harvest stage started for "${field.name}". Stop fertilizer and prepare harvesting.`,
          type: "harvest",
        });
      }
    }

  } catch (error) {
    console.error("❌ Notification Job Error:", error.message);
  }
});