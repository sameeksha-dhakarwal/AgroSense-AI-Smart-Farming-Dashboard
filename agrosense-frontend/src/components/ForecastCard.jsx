import React from "react";

export default function ForecastCard({ day, condition, temp }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4">
      <div className="text-sm font-semibold">{day}</div>
      <div className="text-xs text-gray-500 mt-1">{condition}</div>
      <div className="text-lg font-bold mt-3">{temp}</div>
    </div>
  );
}
