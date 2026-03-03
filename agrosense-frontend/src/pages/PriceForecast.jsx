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
  const [duration, setDuration] = useState("6m");
  const [data, setData] = useState(null);

  const fetchForecast = async () => {
    const res = await getMarketForecast({ crop, duration });

    // 🔥 Add real date to forecast data
    if (res?.forecast) {
      const today = new Date();

      const updatedForecast = res.forecast.map((item, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);

        return {
          ...item,
          date: date.toLocaleDateString(),
        };
      });

      setData({
        ...res,
        forecast: updatedForecast,
      });
    }
  };

  // 🔥 Safely calculate forecast price
  const getForecastPrice = () => {
    if (!data?.forecast?.length) return 0;
    return data.forecast[data.forecast.length - 1].price;
  };

  // 🔥 Safe price change calculation
  const calculateChange = () => {
    if (!data?.currentPrice) return 0;

    const forecastPrice = getForecastPrice();
    if (!forecastPrice) return 0;

    const change =
      ((forecastPrice - data.currentPrice) /
        data.currentPrice) *
      100;

    return change.toFixed(1);
  };

  const forecastPrice = getForecastPrice();
  const priceChange = calculateChange();
  const isRising = priceChange >= 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-6 space-y-6 max-w-6xl">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">
              Price Forecast
            </h1>
            <p className="text-gray-500 text-sm">
              Track historical and predicted crop prices
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              className="border px-3 py-2 rounded-xl bg-white"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              <option value="rice">Rice</option>
              <option value="wheat">Wheat</option>
              <option value="maize">Maize</option>
              <option value="cotton">Cotton</option>
            </select>

            <select
              className="border px-3 py-2 rounded-xl bg-white"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="1m">1 Month</option>
              <option value="3m">3 Months</option>
              <option value="6m">6 Months</option>
              <option value="1y">1 Year</option>
            </select>

            <button
              onClick={fetchForecast}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition"
            >
              Get Forecast
            </button>
          </div>

          {data && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Current Price
                  </p>
                  <p className="text-2xl font-bold">
                    ₹{data.currentPrice}
                  </p>
                  <p className="text-sm text-gray-400">
                    per quintal
                  </p>
                </div>

                <div className="bg-white border rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Forecast Price
                  </p>
                  <p className="text-2xl font-bold">
                    ₹{forecastPrice}
                  </p>
                  <p className="text-sm text-gray-400">
                    Expected soon
                  </p>
                </div>

                <div className="bg-white border rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Price Change
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isRising
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {isRising ? "+" : ""}
                    {priceChange}%
                  </p>

                  <span
                    className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                      isRising
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isRising ? "Rising" : "Falling"}
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">
                  Price Trend
                </h3>

                <div className="h-80">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart data={data.forecast}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke={
                          isRising ? "#16a34a" : "#dc2626"
                        }
                        strokeWidth={3}
                        dot
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}