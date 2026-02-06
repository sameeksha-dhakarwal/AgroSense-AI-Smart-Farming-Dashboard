export const predictYield = ({
  crop,
  ndvi,
  soilMoisture,
  temperature,
}) => {
  if (!ndvi || soilMoisture == null || temperature == null)
    return null;

  let score = 60;

  if (ndvi > 0.6) score += 20;
  else if (ndvi > 0.45) score += 10;
  else score -= 15;

  if (soilMoisture < 40) score -= 10;
  if (temperature > 35) score -= 10;

  if (crop === "rice") score += 5;
  if (crop === "wheat" && temperature > 32) score -= 5;

  return Math.min(100, Math.max(30, score));
};
