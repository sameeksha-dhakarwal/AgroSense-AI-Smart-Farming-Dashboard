import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ForecastCard from "../components/ForecastCard";
import SmartIrrigationCard from "../components/SmartIrrigationCard";
import IrrigationProgressCard from "../components/IrrigationProgressCard";
import AlertBanner from "../components/AlertBanner";
import HarvestPredictionCard from "../components/HarvestPredictionCard";

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

/* Soil moisture simulation */
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
  const [harvest, setHarvest] = useState(null);

  const token = localStorage.getItem("token");

  /* Listen to field change */
  useEffect(() => {
    const handler = () => setField(getActiveField());
    window.addEventListener("active-field-changed", handler);
    return () =>
      window.removeEventListener("active-field-changed", handler);
  }, []);

  /* Load data SAFELY */
  useEffect(() => {
    if (!field?._id) return;

    /* Weekly soil moisture */
    fetch(
      `http://localhost:5000/api/fields/${field._id}/weekly-moisture`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setWeekly([]);
          return;
        }

        const formatted = data.map((item) => ({
          date: new Date(item.date).toLocaleDateString(),
          value: item.value,
        }));

        setWeekly(formatted);
      })
      .catch(() => setWeekly([]));

    /* Fetch field (without triggering infinite loop) */
    fetch(`http://localhost:5000/api/fields/${field._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data?._id) return;

        // 🔥 DO NOT call setField again (prevents loop issues)
        // Only update derived state
        if (data.harvestPrediction) {
          setHarvest(data.harvestPrediction);
        }
      });

    /* Weather */
    if (field.location?.latitude && field.location?.longitude) {
      getCurrentWeather(
        field.location.latitude,
        field.location.longitude
      ).then((data) => {
        setWeather(data);
        setSoilMoisture(simulateSoilMoisture(data));
      });
    }
  }, [field?._id]);

  const insights = getFieldInsights({
    field,
    weather,
    soilMoisture,
  });

  let criticalAlert = null;

  if (field?.nextIrrigationDate) {
    const today = new Date();
    const next = new Date(field.nextIrrigationDate);

    if (today > next) {
      criticalAlert = {
        type: "danger",
        message: "Critical: Irrigation overdue!",
      };
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-6 space-y-6">
          {/* Welcome */}
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

          {/* Alerts */}
          <div className="space-y-3">
            {criticalAlert && (
              <AlertBanner
                type={criticalAlert.type}
                message={criticalAlert.message}
              />
            )}

            {insights?.alerts?.map((alert, i) => (
              <AlertBanner
                key={i}
                type={alert.type}
                message={alert.message}
              />
            ))}
          </div>

          {/* Stats */}
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

          {/* Layout */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ForecastCard field={field} />

              {/* Persistent Weekly Graph */}
              <div className="bg-white border rounded-2xl p-5">
                <h3 className="font-semibold mb-3">
                  Weekly Soil Moisture Trend
                </h3>

                {weekly.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No weekly data available
                  </p>
                ) : (
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weekly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#16a34a"
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {field && (
                <IrrigationProgressCard field={field} />
              )}

              <SmartIrrigationCard
                soilMoisture={soilMoisture}
                advice={insights?.irrigationAdvice}
              />

              {harvest && (
                <HarvestPredictionCard data={harvest} />
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}