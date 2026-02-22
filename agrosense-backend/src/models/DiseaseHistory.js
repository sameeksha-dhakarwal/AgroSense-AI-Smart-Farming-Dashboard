import mongoose from "mongoose";

const diseaseHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    result: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true } // 👈 This enables createdAt & updatedAt
);

export default mongoose.model("DiseaseHistory", diseaseHistorySchema);