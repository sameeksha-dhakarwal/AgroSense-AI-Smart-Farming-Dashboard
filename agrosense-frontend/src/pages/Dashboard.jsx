import { useEffect, useState } from "react";
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
  const [activeField, setActiveField] = useState(null);
  const [latest, setLatest] = useState(null);
  const [weekly, setWeekly] = useState([]);

  // 🔄 Load active field on mount
  useEffect(() => {
    const field = getActiveField();
    setActiveField(field);
  }, []);

  // 🔄 Load readings when field changes
  useEffect(() => {
    if (!activeField?._id) return;

    getLatestReading(activeField._id).then(setLatest);
    getWeeklyReadings(activeField._id).then(setWeekly);
  }, [activeField]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="space-y-6 p-6">
          {/* ===== Header ===== */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back!
              </h1>
              <p className="text-sm text-gray-500">
                Here’s what’s happening with your fields today
              </p>
            </div>

            <button className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white">
              Manage Fields
            </button>
          </div>

          {/* 🚨 No field selected */}
          {!activeField && (
            <div className="rounded-2xl border bg-white p-6 text-center text-gray-600">
              Please select a field from <b>My Fields</b> to view dashboard data.
            </div>
          )}

          {/* ===== Dashboard Content ===== */}
          {activeField && (
            <>
              {/* Stats */}
              <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Soil Moisture"
                  value={latest ? `${latest.soilMoisture}%` : "--"}
                  sub="+5% vs last week"
                />
                <StatCard
                  label="Temperature"
                  value={latest ? `${latest.temperature}°C` : "--"}
                  sub="±0% vs last week"
                />
                <StatCard
                  label="Humidity"
                  value={latest ? `${latest.humidity}%` : "--"}
                  sub="-3% vs last week"
                />
                <StatCard
                  label="Rainfall"
                  value={latest ? `${latest.rainfall} mm` : "--"}
                  sub="+8 mm vs last week"
                />
              </section>

              {/* Two-column layout */}
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left */}
                <div className="space-y-6 lg:col-span-2">
                  <ForecastCard field={activeField} />

                  <div className="rounded-2xl border bg-white p-5">
                    <div className="mb-3 font-semibold">
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

                {/* Right */}
                <div className="space-y-6">
                  <IrrigationProgressCard field={activeField} />
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
