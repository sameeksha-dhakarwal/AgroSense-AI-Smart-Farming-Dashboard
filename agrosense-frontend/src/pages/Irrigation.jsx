import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Irrigation() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-5">
          <div className="rounded-2xl bg-white border border-gray-200 p-6">
            <div className="font-bold text-lg">Smart Irrigation</div>
            <div className="text-sm text-gray-600 mt-2">
              Step 6/9 will add: crop stage tracker + irrigation suggestions based on forecast.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
