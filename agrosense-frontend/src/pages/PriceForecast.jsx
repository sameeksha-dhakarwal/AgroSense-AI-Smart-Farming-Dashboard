import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getMarketForecast } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function PriceForecast() {
  const [crop, setCrop] = useState("rice");
  const [data, setData] = useState(null);

  const fetchForecast = async () => {
    const res = await getMarketForecast({ crop });
    setData(res);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-5 max-w-4xl space-y-5">
          <div className="bg-white border rounded-2xl p-6">
            <div className="font-bold text-lg mb-3">
              Market Price Forecast
            </div>

            <div className="flex gap-3 mb-4">
              <select
                className="border p-2 rounded-xl"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
              >
                <option value="rice">Rice</option>
                <option value="wheat">Wheat</option>
                <option value="maize">Maize</option>
                <option value="cotton">Cotton</option>
              </select>

              <button
                onClick={fetchForecast}
                className="bg-green-600 text-white px-4 rounded-xl"
              >
                Get Forecast
              </button>
            </div>

            {data && (
              <>
                <div className="text-sm mb-2">
                  Current Price: <b>₹{data.currentPrice}/quintal</b>
                </div>
                <div className="text-sm mb-2">
                  Trend: <b>{data.trend}</b>
                </div>
                <div className="text-sm mb-4 text-gray-600">
                  {data.insight}
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.forecast}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="price"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
