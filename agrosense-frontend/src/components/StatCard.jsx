import React from "react";

export default function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs text-gray-500 mt-2">{sub}</div>
    </div>
  );
}
