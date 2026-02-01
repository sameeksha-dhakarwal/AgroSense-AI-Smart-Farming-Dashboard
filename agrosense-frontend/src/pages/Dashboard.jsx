import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ForecastCard from "../components/ForecastCard";
import IrrigationProgressCard from "../components/IrrigationProgressCard";
import { getLatestReading, getWeeklyReadings } from "../api";
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
  const [latest, setLatest] = useState(null);
  const [weekly, setWeekly] = useState([]);

  const field = getActiveField();

  useEffect(() => {
    if (!field) return;

    getLatestReading(field._id).then(setLatest);
    getWeeklyReadings(field._id).then(setWeekly);
  }, [field]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6 space-y-6">
          {/* ===== Welcome Header ===== */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back!
              </h1>
              <p className="text-sm text-gray-500">
                Here’s what’s happening with your fields today
              </p>
            </div>

            <button className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
              Manage Fields
            </button>
          </div>

          {/* ===== Stat Cards (Full Width) ===== */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              label="Soil Moisture"
              value={latest ? `${latest.soilMoisture}%` : "--"}
              sub="+5% vs last week"
              icon="💧"
              trend="up"
              bg="bg-green-50"
            />

            <StatCard
              label="Temperature"
              value={latest ? `${latest.temperature}°C` : "--"}
              sub="±0% vs last week"
              icon="🌡️"
              trend="neutral"
              bg="bg-orange-50"
            />

            <StatCard
              label="Humidity"
              value={latest ? `${latest.humidity}%` : "--"}
              sub="-3% vs last week"
              icon="💨"
              trend="down"
              bg="bg-blue-50"
            />

            <StatCard
              label="Rainfall"
              value={latest ? `${latest.rainfall} mm` : "--"}
              sub="+8 mm vs last week"
              icon="🌧️"
              trend="up"
              bg="bg-emerald-50"
            />
          </section>

          {/* ===== TWO COLUMN SECTION ===== */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              <ForecastCard />

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
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN (1/3 width) */}
            <div className="space-y-6">
              <IrrigationProgressCard />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
