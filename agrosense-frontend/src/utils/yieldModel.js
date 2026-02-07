export const predictYield = ({
  crop,
  ndvi,
  soilMoisture,
  temperature,
  rainfall,
}) => {
  if (!ndvi || !soilMoisture || !temperature) return null;

  // 🌱 Base yield by crop
  const cropBase = {
    rice: 65,
    wheat: 60,
    maize: 58,
    cotton: 55,
    soybean: 57,
    bajra: 52,
  };

  let yieldScore = cropBase[crop?.toLowerCase()] || 55;

  /* NDVI impact */
  if (ndvi > 0.6) yieldScore += 15;
  else if (ndvi > 0.4) yieldScore += 8;
  else yieldScore -= 10;

  /* Soil moisture */
  if (soilMoisture >= 45 && soilMoisture <= 70) yieldScore += 10;
  else yieldScore -= 8;

  /* Temperature stress */
  if (temperature > 35) yieldScore -= 12;
  if (temperature < 10) yieldScore -= 8;

  /* Rain bonus */
  if (rainfall > 0) yieldScore += 5;

  // Clamp 0–100
  return Math.max(0, Math.min(100, Math.round(yieldScore)));
};
