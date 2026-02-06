// src/utils/ndviLogic.js

export const calculateNDVI = ({
  crop,
  soilMoisture,
  temperature,
}) => {
  if (
    soilMoisture == null ||
    temperature == null
  ) {
    return null;
  }

  let baseNDVI = 0.4;

  /* Crop influence */
  switch (crop?.toLowerCase()) {
    case "rice":
      baseNDVI = 0.55;
      break;
    case "wheat":
      baseNDVI = 0.5;
      break;
    case "bajra":
    case "millet":
      baseNDVI = 0.45;
      break;
    default:
      baseNDVI = 0.48;
  }

  /* Moisture influence */
  if (soilMoisture < 30) baseNDVI -= 0.15;
  else if (soilMoisture < 45) baseNDVI -= 0.05;
  else if (soilMoisture > 70) baseNDVI += 0.05;

  /* Temperature stress */
  if (temperature > 35) baseNDVI -= 0.1;
  if (temperature < 10) baseNDVI -= 0.05;

  /* Clamp NDVI */
  return Math.max(0.1, Math.min(0.9, Number(baseNDVI.toFixed(3))));
};

/* NDVI interpretation */
export const ndviStatus = (ndvi) => {
  if (ndvi < 0.2) return "Poor";
  if (ndvi < 0.4) return "Fair";
  if (ndvi < 0.6) return "Good";
  return "Excellent";
};
