import Field from "../models/Field.js";

/* Create field */
export const createField = async (req, res) => {
  try {
    const field = await Field.create({
      ...req.body,
      user: req.user.id,
    });
    res.json(field);
  } catch (e) {
    res.status(400).json({ message: "Failed to create field" });
  }
};

/* Get user's fields */
export const getFields = async (req, res) => {
  const fields = await Field.find({ user: req.user.id });
  res.json(fields);
};

/* Update field */
export const updateField = async (req, res) => {
  const field = await Field.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  res.json(field);
};

/* Delete field */
export const deleteField = async (req, res) => {
  await Field.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  res.json({ message: "Field deleted" });
};
