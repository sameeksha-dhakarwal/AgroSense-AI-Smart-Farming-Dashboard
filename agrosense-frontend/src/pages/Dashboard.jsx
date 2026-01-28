import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
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

        <main className="p-5 space-y-5">
          {/* Stat Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Soil Moisture", value: latest?.soilMoisture + "%" },
              { label: "Temperature", value: latest?.temperature + "°C" },
              { label: "Humidity", value: latest?.humidity + "%" },
              { label: "Rainfall", value: latest?.rainfall + " mm" },
            ].map((s) => (
              <div key={s.label} className="bg-white border rounded-2xl p-4">
                <div className="text-sm text-gray-500">{s.label}</div>
                <div className="text-2xl font-bold mt-1">
                  {latest ? s.value : "--"}
                </div>
              </div>
            ))}
          </section>

          {/* Weekly Chart */}
          <div className="bg-white border rounded-2xl p-4">
            <div className="font-semibold mb-2">
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
        </main>
      </div>
    </div>
  );
}
