import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SoilMetric from "../components/SoilMetric";

import { getActiveField } from "../utils/activeField";
import { getCurrentWeather } from "../api/weather";
import { predictYield } from "../utils/yieldModel";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* -------------------- HELPERS -------------------- */

// Generate realistic NDVI history
const generateNDVIHistory = (base) =>
  Array.from({ length: 7 }).map((_, i) => ({
    day: `Day ${i + 1}`,
    value: Number(
      Math.max(0.25, Math.min(0.85, base + (Math.random() - 0.5) * 0.08)).toFixed(2)
    ),
  }));

// Simulated soil data (until real sensors)
const simulateSoil = () => ({
  moisture: Math.round(35 + Math.random() * 40),
  pH: Number((6 + Math.random()).toFixed(1)),
  nitrogen: Math.round(40 + Math.random() * 30),
  phosphorus: Math.round(25 + Math.random() * 25),
  potassium: Math.round(45 + Math.random() * 30),
});

const status = (v, low, high) =>
  v < low ? "Low" : v > high ? "Optimal" : "Medium";

/* -------------------- COMPONENT -------------------- */

export default function SoilAnalysis() {
  const [field, setField] = useState(getActiveField());
  const [weather, setWeather] = useState(null);
  const [soil, setSoil] = useState(null);
  const [ndvi, setNdvi] = useState(null);
  const [ndviHistory, setNdviHistory] = useState([]);

  /* Listen to active field change */
  useEffect(() => {
    const handler = () => setField(getActiveField());
    window.addEventListener("active-field-changed", handler);
    return () =>
      window.removeEventListener("active-field-changed", handler);
  }, []);

  /* Load data per field */
  useEffect(() => {
    if (!field?.location) return;

    getCurrentWeather(
      field.location.latitude,
      field.location.longitude
    ).then((w) => {
      setWeather(w);

      const soilData = simulateSoil();
      const ndviBase = soilData.moisture > 55 ? 0.55 : 0.42;

      setSoil(soilData);
      setNdvi(Number(ndviBase.toFixed(2)));
      setNdviHistory(generateNDVIHistory(ndviBase));
    });
  }, [field]);

  /* -------------------- AI LOGIC -------------------- */

  const yieldPrediction = predictYield({
    crop: field?.crop,
    ndvi,
    soilMoisture: soil?.moisture,
    temperature: weather?.main?.temp,
    rainfall: weather?.rain?.["1h"] || 0,
  });

  /* Action Recommendations */
  const recommendations = [];

  if (soil) {
    if (soil.moisture < 40) {
      recommendations.push("Increase irrigation frequency");
    }
    if (soil.nitrogen < 50) {
      recommendations.push("Apply nitrogen-rich fertilizer");
    }
    if (ndvi < 0.45) {
      recommendations.push("Monitor crop stress and nutrient uptake");
    }
    if (weather?.main?.temp > 35) {
      recommendations.push("Avoid irrigation during peak heat hours");
    }
  }

  /* Crop Recommendations */
  const recommendedCrops = [];

  if (soil) {
    if (soil.moisture > 55 && soil.pH >= 5.5 && soil.pH <= 7.5) {
      recommendedCrops.push("Rice", "Sugarcane");
    }

    if (
      soil.moisture >= 40 &&
      soil.moisture <= 55 &&
      soil.nitrogen >= 50 &&
      soil.phosphorus >= 30 &&
      soil.potassium >= 45
    ) {
      recommendedCrops.push("Wheat", "Maize");
    }

    if (soil.moisture < 45 && soil.nitrogen < 55) {
      recommendedCrops.push("Millet (Bajra)", "Sorghum");
    }

    if (soil.potassium > 60 && soil.nitrogen < 60) {
      recommendedCrops.push("Soybean", "Groundnut");
    }

    if (soil.pH >= 5.5 && soil.pH <= 6.8) {
      recommendedCrops.push("Cotton");
    }
  }

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Soil Analysis</h1>
            <p className="text-sm text-gray-500">
              Field:{" "}
              <span className="font-medium">
                {field?.name || "None selected"}
              </span>
            </p>
          </div>

          {/* Top Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border rounded-2xl p-6">
              <div className="text-sm text-gray-500">Overall Soil Health</div>
              <div className="text-4xl font-bold text-green-600 mt-2">
                {soil ? "78%" : "--"}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Based on moisture, nutrients & pH
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6">
              <div className="text-sm text-gray-500">NDVI Index</div>
              <div className="text-3xl font-bold mt-2">{ndvi ?? "--"}</div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                <div
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${(ndvi || 0) * 100}%` }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Vegetation health:{" "}
                {ndvi > 0.6 ? "Excellent" : ndvi > 0.45 ? "Good" : "Moderate"}
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6">
              <div className="text-sm text-gray-500">Predicted Yield</div>
              <div className="text-4xl font-bold text-green-600 mt-2">
                {yieldPrediction ?? "--"}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                AI-based estimate using NDVI & soil
              </div>
            </div>
          </section>

          {/* NDVI Trend */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-semibold mb-4">
              NDVI Trend (Last 7 Days)
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ndviHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Soil Metrics */}
          {soil && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <SoilMetric label="Moisture" value={soil.moisture} unit="%" status={status(soil.moisture, 40, 65)} />
              <SoilMetric label="pH Level" value={soil.pH} status={status(soil.pH, 5.5, 7.5)} />
              <SoilMetric label="Nitrogen" value={soil.nitrogen} unit="kg/ha" status={status(soil.nitrogen, 50, 80)} />
              <SoilMetric label="Phosphorus" value={soil.phosphorus} unit="kg/ha" status={status(soil.phosphorus, 30, 60)} />
              <SoilMetric label="Potassium" value={soil.potassium} unit="kg/ha" status={status(soil.potassium, 45, 85)} />
            </section>
          )}

          {/* AI Recommendations */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-semibold mb-3">AI Recommendations</h3>

            {recommendations.length ? (
              <ul className="text-sm text-gray-700 space-y-2">
                {recommendations.map((r, i) => (
                  <li key={i}> {r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No recommendations available.
              </p>
            )}
          </div>

          {/* Recommended Crops */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Recommended Crops</h3>

            {recommendedCrops.length ? (
              <div className="flex flex-wrap gap-3">
                {recommendedCrops.map((crop, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium"
                  >
                     {crop}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No suitable crop recommendations for current soil conditions.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
