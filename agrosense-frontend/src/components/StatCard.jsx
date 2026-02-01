import React from "react";

export default function StatCard({
  label,
  value,
  sub,
  icon,
  trend = "up", // "up" | "down" | "neutral"
  bg = "bg-white",
}) {
  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
      ? "text-red-500"
      : "text-gray-500";

  return (
    <div
      className={`rounded-2xl border border-gray-200 p-5 ${bg}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">
            {label}
          </div>
          <div className="text-2xl font-bold mt-1">
            {value}
          </div>
        </div>

        {icon && (
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white">
            <span className="text-xl">{icon}</span>
          </div>
        )}
      </div>

      {sub && (
        <div
          className={`text-xs mt-3 font-medium ${trendColor}`}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
