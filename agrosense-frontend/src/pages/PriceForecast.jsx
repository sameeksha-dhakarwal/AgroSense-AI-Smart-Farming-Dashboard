import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function PriceForecast() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-5">
          <div className="rounded-2xl bg-white border border-gray-200 p-6">
            <div className="font-bold text-lg">Market Price Forecast</div>
            <div className="text-sm text-gray-600 mt-2">
              Step 10 will add: crop price chart + simple forecast.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
