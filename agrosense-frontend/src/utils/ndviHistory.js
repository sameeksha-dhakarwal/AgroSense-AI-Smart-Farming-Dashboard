import { calculateNDVI } from "./ndviLogic";

/* Generate 7-day NDVI trend */
export const generateNDVIHistory = ({
  field,
  weather,
  soilMoisture,
}) => {
  if (!field || !weather || soilMoisture == null) return [];

  return Array.from({ length: 7 }).map((_, i) => {
    const variation = (Math.random() - 0.5) * 0.08;

    const ndvi = calculateNDVI({
      crop: field.crop,
      soilMoisture: soilMoisture + i - 3,
      temperature: weather.main.temp + i * 0.3,
    });

    return {
      day: `Day ${i + 1}`,
      ndvi: Math.max(0.2, Math.min(0.9, ndvi + variation)),
    };
  });
};
