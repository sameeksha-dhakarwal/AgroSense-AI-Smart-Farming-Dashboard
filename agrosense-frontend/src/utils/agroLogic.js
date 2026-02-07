export const getFieldInsights = ({
  field,
  weather,
  soilMoisture,
  soil,
}) => {
  if (!field || !weather || soilMoisture == null || !soil) {
    return null;
  }

  const temp = weather.main.temp;
  const humidity = weather.main.humidity;

  /* ---------------- ALERTS ---------------- */
  const alerts = [];

  if (soilMoisture < 40) {
    alerts.push({
      type: "danger",
      message: "Low soil moisture detected. Irrigation required.",
    });
  }

  if (temp > 35) {
    alerts.push({
      type: "warning",
      message: "High temperature may cause heat stress.",
    });
  }

  /* ---------------- IRRIGATION ---------------- */
  let irrigationAdvice =
    soilMoisture < 40
      ? "Irrigate within 24 hours."
      : soilMoisture < 60
      ? "Moisture is adequate. Monitor."
      : "No irrigation required.";

  /* ---------------- CROP RECOMMENDATIONS ---------------- */
  const recommendedCrops = [];

  if (soilMoisture > 60 && soil.nitrogen > 55) {
    recommendedCrops.push("Rice", "Sugarcane");
  }

  if (soilMoisture >= 40 && soilMoisture <= 60) {
    recommendedCrops.push("Wheat", "Maize");
  }

  if (soilMoisture < 45) {
    recommendedCrops.push("Bajra", "Millets");
  }

  if (soil.pH >= 6 && soil.pH <= 7.5) {
    recommendedCrops.push("Soybean", "Cotton");
  }

  /* ---------------- GENERAL RECOMMENDATIONS ---------------- */
  const recommendations = [
    irrigationAdvice,
    soil.nitrogen < 50 && "Apply nitrogen fertilizer",
    soil.phosphorus < 35 && "Apply phosphorus fertilizer",
    soil.potassium < 55 && "Potassium supplementation recommended",
    humidity > 75 && "Monitor for fungal disease",
  ].filter(Boolean);

  return {
    alerts,
    recommendations,
    recommendedCrops: [...new Set(recommendedCrops)],
  };
};
