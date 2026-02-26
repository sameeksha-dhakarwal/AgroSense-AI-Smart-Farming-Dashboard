import React from "react";

export default function SmartIrrigationCard({
  soilMoisture,
  advice,
}) {
  return (
    <div className="bg-white border rounded-2xl p-6 space-y-4 shadow-sm">
      <h3 className="font-semibold text-lg">
        Smart Irrigation Advice
      </h3>

      {soilMoisture !== null && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Soil Moisture</span>
            <span className="font-semibold">
              {soilMoisture}%
            </span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-600 rounded-full"
              style={{ width: `${soilMoisture}%` }}
            />
          </div>
        </div>
      )}

      {advice ? (
        <div className="bg-green-50 p-4 rounded-xl text-sm">
          <p className="font-medium mb-1">
            {advice.status}
          </p>
          {advice.water && (
            <p>
              Recommended Water:{" "}
              <span className="font-semibold">
                {advice.water}
              </span>
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No recommendation available
        </p>
      )}
    </div>
  );
}