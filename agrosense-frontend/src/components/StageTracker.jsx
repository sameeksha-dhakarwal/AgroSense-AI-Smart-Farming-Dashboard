import React from "react";

const badge = {
  done: "bg-green-50 text-green-700 border-green-200",
  active: "bg-blue-50 text-blue-700 border-blue-200",
  upcoming: "bg-gray-50 text-gray-600 border-gray-200",
};

export default function StageTracker({ stages }) {
  const progress =
    (stages.filter((s) => s.status === "done").length / stages.length) * 100;

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Irrigation & Crop Lifecycle</div>
          <div className="text-xs text-gray-500 mt-1">
            Track stage-wise progress for better planning
          </div>
        </div>
        <div className="text-sm font-semibold">{Math.round(progress)}%</div>
      </div>

      <div className="h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
        <div className="h-full bg-green-600" style={{ width: `${progress}%` }} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {stages.map((s) => (
          <div
            key={s.name}
            className={[
              "rounded-xl border px-3 py-2 text-sm font-medium",
              badge[s.status],
            ].join(" ")}
          >
            {s.name}
            <div className="text-xs font-normal mt-1 opacity-80">
              {s.status === "done" && "Completed"}
              {s.status === "active" && "Ongoing"}
              {s.status === "upcoming" && "Upcoming"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
