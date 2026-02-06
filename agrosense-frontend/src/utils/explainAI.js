export const explainInsights = ({
  ndvi,
  soilMoisture,
  temperature,
  crop,
}) => {
  const reasons = [];

  if (ndvi < 0.4)
    reasons.push(
      "Low NDVI indicates stressed or sparse vegetation."
    );

  if (soilMoisture < 40)
    reasons.push(
      "Soil moisture is below optimal levels for crop growth."
    );

  if (temperature > 35)
    reasons.push(
      "High temperature increases risk of heat stress."
    );

  if (crop === "rice" && soilMoisture < 60)
    reasons.push(
      "Rice requires higher water availability."
    );

  if (ndvi >= 0.6)
    reasons.push(
      "Healthy vegetation detected based on NDVI."
    );

  return reasons;
};
