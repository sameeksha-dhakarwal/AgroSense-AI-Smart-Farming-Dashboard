import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ForecastCard from "../components/ForecastCard";
import SmartIrrigationCard from "../components/SmartIrrigationCard";
import AlertBanner from "../components/AlertBanner";

import { getWeeklyReadings } from "../api";
import { getCurrentWeather } from "../api/weather";
import { getActiveField } from "../utils/activeField";
import { getUserFromToken } from "../utils/auth";
import { getFieldInsights } from "../utils/agroLogic";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* 🔹 Soil moisture simulation */
const simulateSoilMoisture = (weather) => {
  if (!weather) return null;

  const humidity = weather.main.humidity;
  const rain = weather.rain?.["3h"] || 0;

  let value = 30 + Math.random() * 30;
  if (humidity > 70) value += 10;
  if (rain > 0) value += 20;

  return Math.min(100, Math.round(value));
};

export default function Dashboard() {
  const user = getUserFromToken();

  const [field, setField] = useState(getActiveField());
  const [weather, setWeather] = useState(null);
  const [soilMoisture, setSoilMoisture] = useState(null);
  const [weekly, setWeekly] = useState([]);

  /* Listen to field change from Topbar */
  useEffect(() => {
    const handler = () => setField(getActiveField());
    window.addEventListener("active-field-changed", handler);
    return () =>
      window.removeEventListener("active-field-changed", handler);
  }, []);

  /* Load data when field changes */
  useEffect(() => {
    if (!field) return;

    getWeeklyReadings(field._id).then(setWeekly);

    if (field.location?.latitude && field.location?.longitude) {
      getCurrentWeather(
        field.location.latitude,
        field.location.longitude
      ).then((data) => {
        setWeather(data);
        setSoilMoisture(simulateSoilMoisture(data));
      });
    }
  }, [field]);

  /* 🔹 Central intelligence */
  const insights = getFieldInsights({
    field,
    weather,
    soilMoisture,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6 space-y-6">
          {/* ===== Welcome ===== */}
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.name || "Farmer"}!
            </h1>
            <p className="text-sm text-gray-500">
              Field:{" "}
              <span className="font-medium">
                {field?.name || "None selected"}
              </span>
            </p>
          </div>

          {/* ===== Alerts ===== */}
          <div className="space-y-3">
            {insights?.alerts.map((alert, i) => (
              <AlertBanner
                key={i}
                type={alert.type}
                message={alert.message}
              />
            ))}
          </div>

          {/* ===== Stats ===== */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              label="Soil Moisture"
              icon="💧"
              value={
                soilMoisture !== null ? `${soilMoisture}%` : "--"
              }
              sub="Estimated from weather"
            />

            <StatCard
              label="Temperature"
              icon="🌡️"
              value={
                weather
                  ? `${Math.round(weather.main.temp)}°C`
                  : "--"
              }
              sub="Current temperature"
            />

            <StatCard
              label="Humidity"
              icon="💨"
              value={
                weather ? `${weather.main.humidity}%` : "--"
              }
              sub="Atmospheric humidity"
            />

            <StatCard
              label="Rainfall"
              icon="🌧️"
              value={
                weather?.rain?.["1h"]
                  ? `${weather.rain["1h"]} mm`
                  : "0 mm"
              }
              sub="Last hour"
            />
          </section>

          {/* ===== Two Column Layout ===== */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              <ForecastCard field={field} />

              <div className="bg-white border rounded-2xl p-5">
                <h3 className="font-semibold mb-3">
                  Weekly Soil Moisture Trend
                </h3>

                {weekly.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No weekly data available
                  </p>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weekly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="createdAt"
                          tickFormatter={(v) =>
                            new Date(v).toLocaleDateString()
                          }
                        />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="soilMoisture"
                          stroke="#16a34a"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <SmartIrrigationCard
              soilMoisture={soilMoisture}
              advice={insights?.irrigationAdvice}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
