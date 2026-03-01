import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import IrrigationProgressCard from "../components/IrrigationProgressCard";
import { getActiveField } from "../utils/activeField";
import { getCurrentWeather } from "../api/weather";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Droplets, CloudRain, Thermometer, Leaf } from "lucide-react";

export default function SmartIrrigation() {
  const [field, setField] = useState(getActiveField());
  const [weather, setWeather] = useState(null);
  const [soilMoisture, setSoilMoisture] = useState(55);
  const [recommendation, setRecommendation] = useState(null);
  const [irrigationData, setIrrigationData] = useState([]);

  const token = localStorage.getItem("token");

  /* Listen for active field change */
  useEffect(() => {
    const handler = () => setField(getActiveField());
    window.addEventListener("active-field-changed", handler);
    return () =>
      window.removeEventListener("active-field-changed", handler);
  }, []);

  /* Load Field Data */
  const loadFieldData = async () => {
    if (!field) return;

    const res = await fetch(
      `http://localhost:5000/api/fields/${field._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setField(data);

    const chartData =
      data.irrigationLogs?.map((log) => ({
        date: new Date(log.date).toLocaleDateString(),
        water: parseInt(log.amount) || 0,
      })) || [];

    setIrrigationData(chartData);
  };

  useEffect(() => {
    loadFieldData();
  }, [field?._id]);

  /* Load Weather */
  useEffect(() => {
    if (!field?.location?.latitude) return;

    getCurrentWeather(
      field.location.latitude,
      field.location.longitude
    ).then((data) => {
      setWeather(data);
      calculateRecommendation(data);
    });
  }, [field]);

  /* Calculate Recommendation */
  const calculateRecommendation = (weatherData) => {
    if (!weatherData) return;

    let water = 0;
    let status = "No Irrigation Needed";

    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const rain = weatherData.rain?.["3h"] || 0;

    if (soilMoisture < 40) {
      water = 30;
      status = "High Irrigation Required";
    } else if (soilMoisture < 60) {
      water = 18;
      status = "Moderate Irrigation Recommended";
    }

    if (field?.stage === "Growth") water += 5;
    if (field?.stage === "Harvest") water -= 10;

    if (temp > 32) water += 5;
    if (humidity > 80) water -= 5;

    if (rain > 0) {
      status = "Rain Expected — Delay Irrigation";
      water = 0;
    }

    setRecommendation({ water, status });
  };

  /* Log Irrigation */
  const logIrrigation = async () => {
    if (!field || !recommendation) return;

    await fetch(
      `http://localhost:5000/api/fields/${field._id}/irrigate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: recommendation.water,
        }),
      }
    );

    await loadFieldData();
    alert("Irrigation logged successfully ✅");
  };

  /* Log Fertilizer */
  const logFertilizer = async () => {
    if (!field) return;

    await fetch(
      `http://localhost:5000/api/fields/${field._id}/fertilize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "Nitrogen Boost",
        }),
      }
    );

    await loadFieldData();
    alert("Fertilizer applied successfully 🌱");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-6 space-y-8">

          {field && <IrrigationProgressCard field={field} />}

          {/* Weather & Soil */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border rounded-2xl p-5 flex items-center gap-4">
              <Droplets className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Soil Moisture</p>
                <p className="font-semibold text-lg">{soilMoisture}%</p>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 flex items-center gap-4">
              <Thermometer className="text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Temperature</p>
                <p className="font-semibold text-lg">
                  {weather
                    ? `${Math.round(weather.main.temp)}°C`
                    : "--"}
                </p>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 flex items-center gap-4">
              <CloudRain className="text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500">Rain Forecast</p>
                <p className="font-semibold text-lg">
                  {weather?.rain?.["3h"]
                    ? `${weather.rain["3h"]} mm`
                    : "No rain"}
                </p>
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-white border rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-semibold flex items-center gap-2">
              <Leaf className="text-green-600" />
              AI Irrigation Recommendation
            </h3>

            {recommendation && (
              <div className="bg-green-50 p-4 rounded-xl text-sm space-y-2">
                <div>{recommendation.status}</div>
                <div className="font-semibold">
                  Recommended Water: {recommendation.water} mm
                </div>
              </div>
            )}

            {field?.irrigationLogs?.length > 0 && (
              <div className="text-sm text-gray-500">
                Last Irrigated:{" "}
                {new Date(
                  field.irrigationLogs[
                    field.irrigationLogs.length - 1
                  ].date
                ).toLocaleDateString()}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={logIrrigation}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition"
              >
                Apply Irrigation
              </button>

              <button
                onClick={logFertilizer}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl transition"
              >
                Apply Fertilizer
              </button>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-semibold mb-4">
              Irrigation History Analytics
            </h3>

            {irrigationData.length === 0 ? (
              <p className="text-sm text-gray-500">
                No irrigation data yet
              </p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={irrigationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="water"
                      stroke="#16a34a"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}