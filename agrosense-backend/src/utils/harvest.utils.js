export const calculateHarvestPrediction = (field) => {
  if (!field.stageStartDate) return null;

  const now = new Date();

  /* Average growth durations per crop (days) */
  const cropDurations = {
    Rice: 120,
    Wheat: 110,
    Maize: 100,
    Tomato: 90,
    Potato: 95,
  };

  const totalDuration =
    cropDurations[field.crop] || 100;

  const plantingDate = new Date(field.createdAt);

  const predictedHarvestDate = new Date(
    plantingDate.getTime() +
      totalDuration * 24 * 60 * 60 * 1000
  );

  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (predictedHarvestDate - now) /
        (1000 * 60 * 60 * 24)
    )
  );

  /* Estimated Yield per hectare (kg) */
  const yieldPerHectare = {
    Rice: 6000,
    Wheat: 5000,
    Maize: 5500,
    Tomato: 25000,
    Potato: 20000,
  };

  const yieldRate =
    yieldPerHectare[field.crop] || 4000;

  const estimatedYieldKg =
    (field.area * yieldRate).toFixed(0);

  return {
    predictedHarvestDate,
    daysRemaining,
    estimatedYieldKg,
  };
};