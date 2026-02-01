import React from "react";

const forecast = [
  { day: "Mon", temp: "32°", icon: "☀️" },
  { day: "Tue", temp: "30°", icon: "☁️" },
  { day: "Wed", temp: "28°", icon: "🌧️" },
  { day: "Thu", temp: "31°", icon: "☀️" },
  { day: "Fri", temp: "29°", icon: "💨" },
];

export default function ForecastCard() {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <div className="font-semibold mb-4">
        5-Day Forecast
      </div>

      <div className="grid grid-cols-5 gap-3">
        {forecast.map((f) => (
          <div
            key={f.day}
            className="bg-gray-50 rounded-xl p-3 text-center"
          >
            <div className="text-xs text-gray-500">
              {f.day}
            </div>
            <div className="text-2xl my-2">
              {f.icon}
            </div>
            <div className="text-sm font-semibold">
              {f.temp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
