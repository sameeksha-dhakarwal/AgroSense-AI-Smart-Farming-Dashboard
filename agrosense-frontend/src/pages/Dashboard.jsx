import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ForecastCard from "../components/ForecastCard";
import StageTracker from "../components/StageTracker";
import { latestStats, weeklySeries, forecast, stages } from "../data/mockData";

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
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-5 space-y-5">
          {/* Stat cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestStats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Weekly trends */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Weekly Comparison Trends</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Moisture trend for the past 7 days
                  </div>
                </div>

                <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
                  <option>Soil Moisture</option>
                  <option>Temperature</option>
                  <option>Humidity</option>
                  <option>Rainfall</option>
                </select>
              </div>

              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklySeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="moisture" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Forecast */}
            <div className="rounded-2xl bg-white border border-gray-200 p-4">
              <div className="font-semibold">5-Day Weather Forecast</div>
              <div className="text-xs text-gray-500 mt-1">
                Plan irrigation, planting, and harvest
              </div>
              <div className="grid grid-cols-1 gap-3 mt-4">
                {forecast.map((f) => (
                  <ForecastCard key={f.day} {...f} />
                ))}
              </div>
            </div>
          </section>

          {/* Stage tracker */}
          <StageTracker stages={stages} />
        </main>
      </div>
    </div>
  );
}
