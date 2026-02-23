export const updateFieldStage = (field) => {
  const now = new Date();
  const diffDays = Math.floor(
    (now - field.stageStartDate) / (1000 * 60 * 60 * 24)
  );

  const stageDurations = {
    Preparation: 7,
    Planting: 10,
    Growth: 60,
  };

  if (field.stage === "Preparation" && diffDays >= stageDurations.Preparation) {
    field.stage = "Planting";
    field.stageStartDate = now;
  }

  else if (field.stage === "Planting" && diffDays >= stageDurations.Planting) {
    field.stage = "Growth";
    field.stageStartDate = now;
  }

  else if (field.stage === "Growth" && diffDays >= stageDurations.Growth) {
    field.stage = "Harvest";
    field.stageStartDate = now;
  }

  return field;
};