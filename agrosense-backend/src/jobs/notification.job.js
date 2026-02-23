import cron from "node-cron";
import Field from "../models/Field.js";
import Notification from "../models/Notification.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily irrigation check...");

  const fields = await Field.find();
  const now = new Date();

  for (const field of fields) {

    const lastIrrigation =
      field.irrigationLogs[field.irrigationLogs.length - 1];

    if (
      !lastIrrigation ||
      (now - lastIrrigation.date) / (1000 * 60 * 60 * 24) > 20
    ) {
      await Notification.create({
        user: field.user,
        message: `Time for irrigation in field ${field.name}`,
        type: "irrigation",
      });
    }

    const lastFertilizer =
      field.fertilizerLogs[field.fertilizerLogs.length - 1];

    if (
      !lastFertilizer ||
      (now - lastFertilizer.date) / (1000 * 60 * 60 * 24) > 30
    ) {
      await Notification.create({
        user: field.user,
        message: `Time for fertilizer spraying in field ${field.name}`,
        type: "fertilizer",
      });
    }
  }
});