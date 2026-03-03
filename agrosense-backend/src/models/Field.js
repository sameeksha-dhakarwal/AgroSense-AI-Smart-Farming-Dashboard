import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: Number,
      required: true,
      min: 0,
    },

    crop: {
      type: String,
      required: true,
      trim: true,
    },

    soilType: {
      type: String,
      trim: true,
    },

    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
    },

    /* ===============================
       🌱 Lifecycle
    =============================== */
    stage: {
      type: String,
      enum: ["Preparation", "Planting", "Growth", "Harvest"],
      default: "Preparation",
    },

    stageStartDate: {
      type: Date,
      default: Date.now,
    },

    /* ===============================
       💧 Irrigation Logs
    =============================== */
    irrigationLogs: [
      {
        date: { type: Date, default: Date.now },
        amount: { type: Number, default: 0 },
        wasCritical: { type: Boolean, default: false },
      },
    ],

    /* ===============================
       🌡 Soil Moisture Logs
       (For Weekly Graph)
    =============================== */
    soilMoistureLogs: [
      {
        date: { type: Date, default: Date.now },
        value: { type: Number, required: true },
      },
    ],

    /* ===============================
       🌿 Fertilizer Logs
    =============================== */
    fertilizerLogs: [
      {
        date: { type: Date, default: Date.now },
        type: { type: String, default: "General" },
      },
    ],

    /* ===============================
       🔥 Auto Irrigation Prediction
    =============================== */
    nextIrrigationDate: {
      type: Date,
    },

    /* ===============================
       🌾 Yield Score
    =============================== */
    yieldScore: {
      type: Number,
      default: 75,
      min: 0,
      max: 100,
    },

    /* ===============================
       🌾 Harvest
    =============================== */
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