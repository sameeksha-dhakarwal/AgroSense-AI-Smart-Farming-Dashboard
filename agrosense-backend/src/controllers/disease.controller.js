import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import DiseaseHistory from "../models/DiseaseHistory.js";

/* =========================
   Scan Disease (Strict ML Filtering - Stable Version)
   ========================= */
export const scanDisease = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.path));

    let mlData;

    /* =========================
       Call FastAPI ML Service
       ========================= */
    try {
      const mlResponse = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: req.headers.authorization || "",
          },
          timeout: 20000,
        }
      );

      mlData = mlResponse.data;
    } catch (mlError) {
      console.error(
        "ML SERVICE ERROR:",
        mlError.response?.data || mlError.message
      );

      return res.status(500).json({
        message: "ML service unavailable or unauthorized",
      });
    }

    if (!mlData?.predictions?.length) {
      return res.status(500).json({
        message: "Invalid response from ML service",
      });
    }

    const predictions = mlData.predictions;
    const top1 = predictions[0];
    const top2 = predictions[1] || { confidence: 0 };

    const confidenceThreshold = 85;
    const marginThreshold = 10;

    const confidencePass = top1.confidence >= confidenceThreshold;
    const marginPass =
      top1.confidence - top2.confidence >= marginThreshold;

    const isHealthy =
      top1.disease.toLowerCase().includes("healthy");

    let formattedResponse;

    /* =========================
       Strict Validation Logic
       ========================= */
    if (!confidencePass || !marginPass) {
      formattedResponse = {
        predictions: [
          {
            disease: "Uncertain Diagnosis",
            confidence: top1.confidence,
          },
        ],
        description:
          "The AI is not sufficiently confident in this diagnosis. Please upload a clearer image.",
        plants: [],
        treatment: [
          "Ensure good lighting",
          "Capture the affected area clearly",
          "Avoid background noise",
          "Consult agricultural expert",
        ],
      };
    } 
    else if (isHealthy) {
      formattedResponse = {
        predictions,
        description:
          "The crop appears healthy with no visible signs of disease.",
        plants: mlData.plants || [],
        treatment: [
          "No treatment needed. Continue regular monitoring.",
        ],
      };
    } 
    else {
      formattedResponse = {
        predictions,
        description:
          mlData.description ||
          "AI-based crop disease analysis result.",
        plants: mlData.plants || [],
        treatment:
          mlData.treatment ||
          ["Consult agricultural expert for treatment."],
      };
    }

    /* =========================
       Save To MongoDB
       ========================= */
    await DiseaseHistory.create({
      user: req.user.id,
      image: `http://localhost:5000/uploads/${file.filename}`,
      result: formattedResponse,
    });

    return res.json(formattedResponse);
  } catch (error) {
    console.error("Disease Scan Error:", error);
    return res.status(500).json({
      message: "Disease prediction failed",
    });
  }
};

/* =========================
   Get History
   ========================= */
export const getHistory = async (req, res) => {
  try {
    const history = await DiseaseHistory.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.json(history);
  } catch (error) {
    console.error("History Error:", error);
    return res.status(500).json({
      message: "Failed to load history",
    });
  }
};

/* =========================
   Delete History
   ========================= */
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await DiseaseHistory.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!history) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    await history.deleteOne();

    return res.json({
      message: "History deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({
      message: "Failed to delete history",
    });
  }
};