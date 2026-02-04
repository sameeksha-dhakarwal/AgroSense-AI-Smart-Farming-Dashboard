import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ForecastCard from "../components/ForecastCard";
import IrrigationProgressCard from "../components/IrrigationProgressCard";
import { getLatestReading, getWeeklyReadings } from "../api";
import { getCurrentWeather } from "../api/weather";
import { getActiveField } from "../utils/activeField";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [field, setField] = useState(getActiveField());
  const [latest, setLatest] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [weather, setWeather] = useState(null);

  // Listen to active field change
  useEffect(() => {
    const handler = () => setField(getActiveField());
    window.addEventListener("active-field-changed", handler);
    return () =>
      window.removeEventListener("active-field-changed", handler);
  }, []);

  // Load data when field changes
  useEffect(() => {
    if (!field) return;

    // Soil readings
    getLatestReading(field._id).then(setLatest);
    getWeeklyReadings(field._id).then(setWeekly);

    // Weather
    if (field.location?.latitude && field.location?.longitude) {
      getCurrentWeather(
        field.location.latitude,
        field.location.longitude
      )
        .then(setWeather)
        .catch(() => setWeather(null));
    }
  }, [field]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6 space-y-6">
          {/* Welcome */}
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back{field ? `, ${field.name}` : ""}!
            </h1>
            <p className="text-sm text-gray-500">
              Here’s what’s happening with your fields today
            </p>
          </div>

          {/* Stat Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              label="Soil Moisture"
              icon="💧"
              value={
                latest
                  ? `${latest.soilMoisture}%`
                  : "--"
              }
              sub={
                latest ? "From soil sensor" : "No sensor data yet"
              }
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
                weather
                  ? `${weather.main.humidity}%`
                  : "--"
              }
              sub="Atmospheric humidity"
            />

            <StatCard
              label="Rainfall"
              icon="🌧️"
              value={
                weather?.rain
                  ? `${weather.rain["1h"] || 0} mm`
                  : "0 mm"
              }
              sub="Last hour"
            />
          </section>

          {/* Two-column layout */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              <ForecastCard field={field} />

              <div className="bg-white border rounded-2xl p-5">
                <div className="font-semibold mb-3">
                  Weekly Soil Moisture Trend
                </div>

                {weekly.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No weekly data available
                  </div>
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

            {/* Right */}
            <IrrigationProgressCard />
          </section>
        </main>
      </div>
    </div>
  );
}
