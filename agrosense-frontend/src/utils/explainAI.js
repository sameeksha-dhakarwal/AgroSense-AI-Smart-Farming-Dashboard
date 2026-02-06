export const explainInsights = ({
  ndvi,
  soilMoisture,
  temperature,
  rainExpected,
}) => {
  const reasons = [];

  if (ndvi < 0.4)
    reasons.push(
      "Low NDVI indicates stressed vegetation"
    );

  if (soilMoisture < 40)
    reasons.push(
      "Soil moisture is below optimal range"
    );

  if (temperature > 35)
    reasons.push(
      "High temperature may cause heat stress"
    );

  if (rainExpected)
    reasons.push(
      "Upcoming rainfall influences irrigation advice"
    );

  return reasons;
};
