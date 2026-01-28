export const getIrrigationAdvice = (req, res) => {
  const { moisture, stage, temperature, rainExpected } = req.body;

  let status = "No Irrigation Needed";
  let water = "0 mm";
  let advice = [];

  if (moisture < 40) {
    status = "Irrigation Required";
    water = "25–30 mm";
    advice.push("Soil moisture is very low.");
  } else if (moisture < 60) {
    status = "Moderate Irrigation";
    water = "10–15 mm";
    advice.push("Soil moisture is moderate.");
  } else {
    advice.push("Soil moisture is sufficient.");
  }

  if (stage === "Growth") {
    advice.push("Crop is in growth stage — higher water demand.");
  }

  if (stage === "Harvest") {
    advice.push("Crop is near harvest — reduce irrigation.");
    water = "5–8 mm";
  }

  if (rainExpected) {
    status = "Delay Irrigation";
    water = "0 mm";
    advice.push("Rain is expected — irrigation can be delayed.");
  }

  res.json({
    status,
    water,
    advice,
  });
};
