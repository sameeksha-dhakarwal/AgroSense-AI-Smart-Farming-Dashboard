import Reading from "../models/Reading.js";

/* Add manual reading */
export const addReading = async (req, res) => {
  try {
    const reading = await Reading.create(req.body);
    res.json(reading);
  } catch (e) {
    res.status(400).json({ message: "Failed to add reading" });
  }
};

/* Latest reading per field */
export const getLatestReading = async (req, res) => {
  const { fieldId } = req.params;

  const reading = await Reading.findOne({ field: fieldId }).sort({
    createdAt: -1,
  });

  res.json(reading);
};

/* Weekly readings per field */
export const getWeeklyReadings = async (req, res) => {
  const { fieldId } = req.params;

  const readings = await Reading.find({ field: fieldId })
    .sort({ createdAt: -1 })
    .limit(7);

  res.json(readings.reverse());
};
