import React from "react";

const STAGES = ["Preparation", "Planting", "Growth", "Harvest"];

export default function IrrigationProgressCard({ field }) {
  if (!field) return null;

  const currentStage = field.stage || "Preparation";
  const currentIndex = STAGES.indexOf(currentStage);

  const progress = Math.round((currentIndex / (STAGES.length - 1)) * 100);

  return (
    <div className="bg-white border rounded-2xl p-5">
      <div className="font-semibold mb-4">
        Irrigation Progress
      </div>

      {/* ===== Progress Bar ===== */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Overall Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-green-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ===== Lifecycle Stages ===== */}
      <div className="space-y-3">
        {STAGES.map((stage, index) => {
          let status = "pending";

          if (index < currentIndex) status = "done";
          if (index === currentIndex) status = "active";

          return (
            <div
              key={stage}
              className="flex items-center gap-3"
            >
              <div
                className={`h-3 w-3 rounded-full ${
                  status === "done"
                    ? "bg-green-600"
                    : status === "active"
                    ? "bg-yellow-500"
                    : "bg-gray-300"
                }`}
              />

              <span
                className={`text-sm ${
                  status === "active"
                    ? "font-semibold"
                    : "text-gray-600"
                }`}
              >
                {stage}
                {status === "active" && " (Ongoing)"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}