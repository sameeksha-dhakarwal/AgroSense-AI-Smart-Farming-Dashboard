// src/utils/agroLogic.js

export const getFieldInsights = ({
  field,
  weather,
  soilMoisture,
}) => {
  if (!field || !weather || soilMoisture == null) {
    return null;
  }

  const crop = field.crop?.toLowerCase();
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const rainExpected =
    weather.rain?.["3h"] > 0 || weather.weather?.[0]?.main === "Rain";

  /* ================= ALERTS ================= */
  const alerts = [];

  if (soilMoisture < 35) {
    alerts.push({
      type: "danger",
      message:
        "Low soil moisture detected. Immediate irrigation is recommended.",
    });
  }

  if (temp > 35) {
    alerts.push({
      type: "warning",
      message:
        "High temperature detected. Crops may experience heat stress.",
    });
  }

  if (humidity > 80) {
    alerts.push({
      type: "info",
      message:
        "High humidity detected. Monitor crops for fungal diseases.",
    });
  }

  /* ================= IRRIGATION ADVICE ================= */
  let irrigationAdvice = "";

  if (soilMoisture < 40 && !rainExpected) {
    irrigationAdvice =
      "Irrigation required within the next 24 hours.";
  } else if (soilMoisture >= 40 && soilMoisture <= 60) {
    irrigationAdvice =
      "Soil moisture is adequate. Continue monitoring.";
  } else {
    irrigationAdvice =
      "No irrigation required at this time.";
  }

  /* ================= RECOMMENDATIONS ================= */
  const recommendations = [];

  // Moisture-based
  if (soilMoisture < 40) {
    recommendations.push(
      "Increase irrigation frequency to improve soil moisture."
    );
  }

  if (soilMoisture > 75) {
    recommendations.push(
      "Soil moisture is high. Avoid over-irrigation."
    );
  }

  // Crop-specific
  switch (crop) {
    case "rice":
      recommendations.push(
        soilMoisture < 60
          ? "Rice requires standing water. Increase irrigation levels."
          : "Water levels are sufficient for rice cultivation."
      );
      break;

    case "wheat":
      recommendations.push(
        temp > 30
          ? "High temperature may reduce wheat yield. Consider light irrigation."
          : "Temperature conditions are suitable for wheat."
      );
      break;

    case "bajra":
    case "millet":
      recommendations.push(
        soilMoisture > 70
          ? "Millets prefer drier soil. Reduce irrigation."
          : "Moisture level is suitable for millet crops."
      );
      break;

    default:
      recommendations.push(
        "Monitor crop-specific requirements for optimal yield."
      );
  }

  // Weather-based
  if (rainExpected) {
    recommendations.push(
      "Rain is expected. Delay irrigation to prevent waterlogging."
    );
  }

  // Guarantee meaningful output
  if (recommendations.length < 2) {
    recommendations.push(
      "Maintain regular soil and crop monitoring."
    );
  }

  return {
    alerts,
    irrigationAdvice,
    recommendations,
  };
};
