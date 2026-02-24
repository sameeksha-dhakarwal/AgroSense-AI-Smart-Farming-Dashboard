import React from "react";
import { Calendar, TrendingUp } from "lucide-react";

export default function HarvestPredictionCard({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="font-semibold text-lg">
        Harvest Prediction
      </h3>

      <div className="flex items-center gap-3">
        <Calendar className="text-green-600" />
        <div>
          <p className="text-sm text-gray-500">
            Predicted Harvest Date
          </p>
          <p className="font-semibold">
            {new Date(
              data.predictedHarvestDate
            ).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <TrendingUp className="text-yellow-600" />
        <div>
          <p className="text-sm text-gray-500">
            Estimated Yield
          </p>
          <p className="font-semibold">
            {data.estimatedYieldKg} kg
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-xl text-center">
        <p className="text-sm text-gray-600">
          Days Remaining
        </p>
        <p className="text-2xl font-bold text-green-700">
          {data.daysRemaining} Days
        </p>
      </div>
    </div>
  );
}