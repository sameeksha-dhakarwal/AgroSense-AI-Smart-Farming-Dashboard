import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    crop: {
      type: String,
      required: true,
    },
    soilType: {
      type: String,
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },

    // 🌱 Lifecycle
    stage: {
      type: String,
      enum: ["Preparation", "Planting", "Growth", "Harvest"],
      default: "Preparation",
    },
    stageStartDate: {
      type: Date,
      default: Date.now,
    },

    // 💧 Logs
    irrigationLogs: [
      {
        date: { type: Date, default: Date.now },
        amount: Number,
      },
    ],

    fertilizerLogs: [
      {
        date: { type: Date, default: Date.now },
        type: String,
      },
    ],

    harvestDate: {
      type: Date,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Field", FieldSchema);