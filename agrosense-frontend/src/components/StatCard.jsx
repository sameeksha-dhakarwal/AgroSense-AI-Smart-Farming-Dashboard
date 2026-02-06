import React from "react";

export default function StatCard({ label, value, sub, icon }) {
  return (
    <div className="rounded-2xl bg-white border p-5">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="h-10 w-10 rounded-xl bg-green-50 grid place-items-center text-xl">
            {icon}
          </div>
        )}
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>

      {sub && (
        <div className="text-xs text-gray-500 mt-2">{sub}</div>
      )}
    </div>
  );
}

