export const analyzeSoil = async (req, res) => {
  const { ph, nitrogen, phosphorus, potassium, moisture } = req.body;

  let recommendations = [];
  let status = "Healthy";

  // pH analysis
  if (ph < 5.5) {
    status = "Poor";
    recommendations.push("Soil is acidic. Add lime to increase pH.");
  } else if (ph > 7.5) {
    status = "Poor";
    recommendations.push("Soil is alkaline. Add organic compost.");
  } else {
    recommendations.push("Soil pH is optimal.");
  }

  // Nutrient analysis
  if (nitrogen < 40) recommendations.push("Low nitrogen: Apply urea or compost.");
  if (phosphorus < 30) recommendations.push("Low phosphorus: Use DAP fertilizer.");
  if (potassium < 30) recommendations.push("Low potassium: Apply potash.");

  // Moisture analysis
  if (moisture < 50)
    recommendations.push("Soil moisture is low. Increase irrigation.");
  else
    recommendations.push("Soil moisture level is sufficient.");

  res.json({
    status,
    recommendations,
  });
};
