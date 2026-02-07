export const generateNDVIHistory = ({ field, soilMoisture }) => {
  if (!field) return [];

  const seed = field._id
    .split("")
    .reduce((s, c) => s + c.charCodeAt(0), 0);

  const base =
    soilMoisture > 60 ? 0.65 :
    soilMoisture > 45 ? 0.52 :
    soilMoisture > 30 ? 0.42 : 0.32;

  return Array.from({ length: 7 }).map((_, i) => {
    const drift = (seed % (i + 5)) * 0.003;
    const dailyVariation = Math.sin(i + seed) * 0.015;

    return {
      day: `Day ${i + 1}`,
      ndvi: Number(
        Math.max(0.2, Math.min(0.9, base + drift + dailyVariation))
          .toFixed(2)
      ),
    };
  });
};
