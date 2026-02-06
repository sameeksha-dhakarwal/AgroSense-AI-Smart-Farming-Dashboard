export const predictYield = ({
  crop,
  ndvi,
  soilMoisture,
  temperature,
}) => {
  if (!ndvi || soilMoisture == null || temperature == null)
    return null;

  let base = 60;

  if (ndvi > 0.6) base += 20;
  else if (ndvi > 0.4) base += 10;
  else base -= 15;

  if (soilMoisture < 40) base -= 10;
  if (temperature > 35) base -= 10;

  if (crop === "rice") base += 5;
  if (crop === "wheat" && temperature > 32) base -= 5;

  return Math.min(100, Math.max(30, base));
};
