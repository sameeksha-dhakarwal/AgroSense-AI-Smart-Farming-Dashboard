import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import IrrigationProgressCard from "../components/IrrigationProgressCard";
import { getActiveField } from "../utils/activeField";
import { getFieldInsights } from "../utils/agroLogic";

export default function SmartIrrigation() {
  const [field, setField] = useState(getActiveField());
  const [soilMoisture, setSoilMoisture] = useState(55);
  const [loadingIrrigation, setLoadingIrrigation] = useState(false);
  const [loadingFertilizer, setLoadingFertilizer] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handler = () => setField(getActiveField());
    window.addEventListener("active-field-changed", handler);
    return () =>
      window.removeEventListener("active-field-changed", handler);
  }, []);

  const insights = getFieldInsights({
    field,
    soilMoisture,
  });

  /* =========================
     Manual Irrigation Logging
  ========================= */
  const logIrrigation = async () => {
    if (!field) return alert("Select a field first");

    try {
      setLoadingIrrigation(true);

      const res = await fetch(
        `http://localhost:5000/api/fields/${field._id}/irrigate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: "25mm" }),
        }
      );

      if (!res.ok) throw new Error("Failed");

      alert("Irrigation logged successfully 🌱");
    } catch (error) {
      alert("Failed to log irrigation");
    } finally {
      setLoadingIrrigation(false);
    }
  };

  /* =========================
     Manual Fertilizer Logging
  ========================= */
  const logFertilizer = async () => {
    if (!field) return alert("Select a field first");

    try {
      setLoadingFertilizer(true);

      const res = await fetch(
        `http://localhost:5000/api/fields/${field._id}/fertilize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type: "Nitrogen-based" }),
        }
      );

      if (!res.ok) throw new Error("Failed");

      alert("Fertilizer logged successfully 🌾");
    } catch (error) {
      alert("Failed to log fertilizer");
    } finally {
      setLoadingFertilizer(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">
            Smart Irrigation Control
          </h1>

          {/* ===== Progress Card ===== */}
          {field && <IrrigationProgressCard field={field} />}

          {/* ===== Irrigation Recommendation ===== */}
          <div className="bg-white border rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold">
              AI Irrigation Recommendation
            </h3>

            <div className="flex justify-between items-center">
              <span>Soil Moisture</span>
              <span className="font-semibold">
                {soilMoisture}%
              </span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${soilMoisture}%` }}
              />
            </div>

            <div className="bg-green-50 p-4 rounded-xl text-sm">
              {insights?.irrigationAdvice?.status ||
                "No recommendation available"}
            </div>
          </div>

          {/* ===== Manual Logging Section ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Irrigation */}
            <div className="bg-white border rounded-2xl p-5 space-y-3">
              <h4 className="font-semibold">
                Log Irrigation
              </h4>

              <button
                onClick={logIrrigation}
                disabled={loadingIrrigation}
                className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loadingIrrigation
                  ? "Logging..."
                  : "Mark Irrigated"}
              </button>
            </div>

            {/* Fertilizer */}
            <div className="bg-white border rounded-2xl p-5 space-y-3">
              <h4 className="font-semibold">
                Log Fertilizer
              </h4>

              <button
                onClick={logFertilizer}
                disabled={loadingFertilizer}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loadingFertilizer
                  ? "Logging..."
                  : "Mark Fertilized"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}