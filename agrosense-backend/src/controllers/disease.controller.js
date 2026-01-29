export const scanDisease = async (req, res) => {
  // image file info
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  // 🔮 Rule-based AI (mock logic)
  // Later replace with ML model
  const diseases = [
    {
      name: "Leaf Blight",
      severity: "High",
      treatment: [
        "Apply fungicide containing Mancozeb",
        "Remove infected leaves",
        "Avoid overhead irrigation",
      ],
    },
    {
      name: "Healthy Crop",
      severity: "None",
      treatment: ["No action needed"],
    },
  ];

  // Random result for demo realism
  const result =
    Math.random() > 0.4 ? diseases[0] : diseases[1];

  res.json({
    image: file.filename,
    disease: result.name,
    severity: result.severity,
    treatment: result.treatment,
  });
};
