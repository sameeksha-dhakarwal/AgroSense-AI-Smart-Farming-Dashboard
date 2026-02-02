import Field from "../models/Field.js";

/* CREATE FIELD */
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
      user: req.user._id,
    });

    res.status(201).json(field);
  } catch (err) {
    console.error("CREATE FIELD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* GET FIELDS */
export const getFields = async (req, res) => {
  const fields = await Field.find({ user: req.user._id });
  res.json(fields);
};

/* UPDATE FIELD */
export const updateField = async (req, res) => {
  const field = await Field.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  res.json(field);
};

/* DELETE FIELD */
export const deleteField = async (req, res) => {
  await Field.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  res.json({ message: "Field deleted" });
};
