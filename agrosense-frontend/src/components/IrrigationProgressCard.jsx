import React from "react";

const stages = [
  { label: "Preparation", status: "done" },
  { label: "Planting", status: "done" },
  { label: "Growth", status: "active" },
  { label: "Harvest", status: "pending" },
];

// simple static progress (can be dynamic later)
const progress = 65;

export default function IrrigationProgressCard() {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <div className="font-semibold mb-4">
        Irrigation Progress
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Overall Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-green-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-3">
        {stages.map((stage) => (
          <div
            key={stage.label}
            className="flex items-center gap-3"
          >
            <div
              className={`h-3 w-3 rounded-full ${
                stage.status === "done"
                  ? "bg-green-600"
                  : stage.status === "active"
                  ? "bg-yellow-500"
                  : "bg-gray-300"
              }`}
            />

            <span
              className={`text-sm ${
                stage.status === "active"
                  ? "font-semibold"
                  : "text-gray-600"
              }`}
            >
              {stage.label}
              {stage.status === "active" && " (Ongoing)"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
