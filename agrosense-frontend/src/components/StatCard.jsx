import React from "react";

export default function StatCard({ label, value, icon, sub }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4 flex items-center gap-4">
      {/* Icon */}
      <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-2xl font-bold mt-0.5">{value}</div>
        {sub && (
          <div className="text-xs text-gray-500 mt-1">{sub}</div>
        )}
      </div>
    </div>
  );
}
