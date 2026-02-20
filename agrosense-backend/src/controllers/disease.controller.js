import DiseaseHistory from "../models/DiseaseHistory.js";

/* =========================
   Scan Disease
   ========================= */
export const scanDisease = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Mock AI logic (replace later with ML call)
    const diseases = [
      {
        disease: "Leaf Blight",
        confidence: 87,
        description:
          "Leaf Blight is a fungal disease that causes browning and drying of leaves.",
        plants: ["Rice", "Wheat", "Maize"],
        treatment: [
          "Apply fungicide containing Mancozeb",
          "Remove infected leaves",
          "Avoid overhead irrigation",
        ],
      },
      {
        disease: "Healthy Leaf",
        confidence: 92,
        description:
          "The crop appears healthy with no visible signs of disease.",
        plants: ["All Crops"],
        treatment: ["No action needed"],
      },
    ];

    const mainResult =
      Math.random() > 0.4 ? diseases[0] : diseases[1];

    const response = {
      predictions: [
        {
          disease: mainResult.disease,
          confidence: mainResult.confidence,
        },
        {
          disease: "Powdery Mildew",
          confidence: 45,
        },
        {
          disease: "Rust",
          confidence: 30,
        },
      ],
      description: mainResult.description,
      plants: mainResult.plants,
      treatment: mainResult.treatment,
    };

    // 🔥 SAVE TO DATABASE
    const newHistory = await DiseaseHistory.create({
      user: req.user.id,
      image: `http://localhost:5000/uploads/${file.filename}`,
      result: response,
    });

    return res.json(response);
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
    return res.status(500).json({
      message: "Failed to load history",
    });
  }
};