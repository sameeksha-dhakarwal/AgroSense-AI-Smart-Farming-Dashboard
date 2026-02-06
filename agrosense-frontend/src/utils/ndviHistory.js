import { calculateNDVI } from "./ndviLogic";

export const generateNDVIHistory = ({
  field,
  weather,
  soilMoisture,
}) => {
  if (!field || !weather || soilMoisture == null) return [];

  return Array.from({ length: 7 }).map((_, i) => {
    const ndvi = calculateNDVI({
      crop: field.crop,
      soilMoisture: soilMoisture + (i - 3),
      temperature: weather.main.temp + i * 0.4,
    });

    return {
      day: `Day ${i + 1}`,
      ndvi: Number(
        Math.max(0.2, Math.min(0.9, ndvi)).toFixed(2)
      ),
    };
  });
};
