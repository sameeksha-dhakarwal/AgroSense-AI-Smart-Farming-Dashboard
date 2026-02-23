export const calculateProgress = (field) => {
  const stages = ["Preparation", "Planting", "Growth", "Harvest"];

  const completedIndex = stages.indexOf(field.stage);

  if (completedIndex === -1) return 0;

  return Math.round((completedIndex / 3) * 100);
};