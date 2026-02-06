import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SoilMetric from "../components/SoilMetric";
import NDVICard from "../components/NDVICard";

import { getActiveField } from "../utils/activeField";
import { getCurrentWeather } from "../api/weather";
import { getFieldInsights } from "../utils/agroLogic";
import { calculateNDVI } from "../utils/ndviLogic";
import { explainInsights } from "../utils/explainAI";

/* ================= FIELD-STABLE SOIL SIMULATION ================= */
const simulateSoilData = (weather, field) => {
  if (!weather || !field) return null;

  // Stable seed per field
  const seed = field._id
    .split("")
    .reduce((sum, c) => sum + c.charCodeAt(0), 0);

  const crop = field.crop?.toLowerCase();
  const baseMoisture = crop === "rice" ? 65 : crop === "bajra" ? 45 : 50;

  return {
    moisture: Math.max(
      25,
      Math.min(85, baseMoisture + (seed % 15) - 7)
    ),
    pH: Number((6.2 + (seed % 10) / 20).toFixed(1)),
    nitrogen: 45 + (seed % 20),
    phosphorus: 30 + (seed % 15),
    potassium: 50 + (seed % 25),
  };
};

/* ================= STATUS LABEL ================= */
const status = (val, low, high) =>
  val < low ? "Low" : val > high ? "Optimal" : "Medium";

export default function SoilAnalysis() {
  const [field, setField] = useState(getActiveField());
  const [weather, setWeather] = useState(null);
  const [soil, setSoil] = useState(null);

  /* Listen for active field change */
  useEffect(() => {
    const handler = () => setField(getActiveField());
    window.addEventListener("active-field-changed", handler);
    return () =>
      window.removeEventListener("active-field-changed", handler);
  }, []);

  /* Load weather + soil when field changes */
  useEffect(() => {
    if (!field) return;

    if (field.location?.latitude && field.location?.longitude) {
      getCurrentWeather(
        field.location.latitude,
        field.location.longitude
      ).then((data) => {
        setWeather(data);
        setSoil(simulateSoilData(data, field));
      });
    }
  }, [field]);

  /* AI INSIGHTS */
  const insights = getFieldInsights({
    field,
    weather,
    soilMoisture: soil?.moisture,
  });

  const ndvi =
    soil && weather
      ? calculateNDVI({
          crop: field?.crop,
          soilMoisture: soil.moisture,
          temperature: weather.main.temp,
        })
      : null;

  const reasons = insights
    ? explainInsights({
        ndvi,
        soilMoisture: soil?.moisture,
        temperature: weather?.main?.temp,
        rainExpected:
          weather?.rain?.["3h"] > 0 ||
          weather?.weather?.[0]?.main === "Rain",
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6 space-y-6">
          {/* ===== Header ===== */}
          <div>
            <h1 className="text-2xl font-bold">Soil Analysis</h1>
            <p className="text-sm text-gray-500">
              Field:{" "}
              <span className="font-medium">
                {field?.name || "None selected"}
              </span>
            </p>
          </div>

          {/* ===== Summary Cards ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border rounded-2xl p-6">
              <div className="text-sm text-gray-500">
                Overall Soil Health
              </div>
              <div className="text-4xl font-bold text-green-600 mt-2">
                {soil ? "78%" : "--"}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Based on moisture, nutrients & pH
              </div>
            </div>

            <NDVICard ndvi={ndvi} />
          </div>

          {/* ===== Alerts ===== */}
          {insights?.alerts?.length > 0 && (
            <div className="bg-white border rounded-2xl p-6">
              <h3 className="font-semibold mb-3">Alerts</h3>
              <ul className="space-y-2 text-sm">
                {insights.alerts.map((a, i) => (
                  <li
                    key={i}
                    className={`p-3 rounded-xl ${
                      a.type === "danger"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    ⚠️ {a.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ===== Soil Metrics ===== */}
          {soil ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <SoilMetric
                label="Moisture"
                value={soil.moisture}
                unit="%"
                status={status(soil.moisture, 40, 65)}
              />
              <SoilMetric
                label="pH Level"
                value={soil.pH}
                unit=""
                status={status(soil.pH, 5.5, 7.5)}
              />
              <SoilMetric
                label="Nitrogen"
                value={soil.nitrogen}
                unit="kg/ha"
                status={status(soil.nitrogen, 50, 75)}
              />
              <SoilMetric
                label="Phosphorus"
                value={soil.phosphorus}
                unit="kg/ha"
                status={status(soil.phosphorus, 30, 60)}
              />
              <SoilMetric
                label="Potassium"
                value={soil.potassium}
                unit="kg/ha"
                status={status(soil.potassium, 50, 85)}
              />
            </section>
          ) : (
            <p className="text-sm text-gray-500">
              Select a field to view soil analysis.
            </p>
          )}

          {/* ===== Recommendations ===== */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-semibold mb-3">
              AI Recommendations
            </h3>

            {insights?.recommendations?.length ? (
              <ul className="text-sm text-gray-700 space-y-2">
                {insights.recommendations.map((rec, i) => (
                  <li key={i}>🌱 {rec}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No recommendations available.
              </p>
            )}
          </div>

          {/* ===== Explainable AI ===== */}
          {reasons.length > 0 && (
            <div className="bg-white border rounded-2xl p-6">
              <h3 className="font-semibold mb-3">
                Why this advice?
              </h3>

              <ul className="text-sm text-gray-700 space-y-2">
                {reasons.map((r, i) => (
                  <li key={i}>🧠 {r}</li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
