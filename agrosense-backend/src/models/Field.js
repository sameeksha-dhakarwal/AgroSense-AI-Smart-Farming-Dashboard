import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    crop: { type: String, required: true },
    location: { type: String, required: true },
    area: { type: Number }, // in acres
  },
  { timestamps: true }
);

export default mongoose.model("Field", fieldSchema);
