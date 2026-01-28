import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getIrrigationAdvice } from "../api";

export default function SmartIrrigation() {
  const [form, setForm] = useState({
    moisture: "",
    stage: "Growth",
    temperature: "",
    rainExpected: false,
  });

  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const res = await getIrrigationAdvice(form);
    setResult(res);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-5 max-w-4xl">
          <div className="bg-white border rounded-2xl p-6">
            <div className="font-bold text-lg">Smart Irrigation</div>

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                className="border p-3 rounded-xl"
                placeholder="Soil Moisture (%)"
                value={form.moisture}
                onChange={(e) => setForm({ ...form, moisture: e.target.value })}
                required
              />

              <select
                className="border p-3 rounded-xl"
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
              >
                <option>Preparation</option>
                <option>Planting</option>
                <option>Growth</option>
                <option>Harvest</option>
              </select>

              <input
                className="border p-3 rounded-xl"
                placeholder="Temperature (°C)"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: e.target.value })}
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.rainExpected}
                  onChange={(e) =>
                    setForm({ ...form, rainExpected: e.target.checked })
                  }
                />
                Rain expected
              </label>

              <button className="bg-green-600 text-white rounded-xl p-3 font-semibold md:col-span-2">
                Get Recommendation
              </button>
            </form>

            {result && (
              <div className="mt-6 border-t pt-4">
                <div className="font-semibold">
                  Status:{" "}
                  <span className="text-green-700">{result.status}</span>
                </div>
                <div className="text-sm mt-1">
                  Recommended Water: <b>{result.water}</b>
                </div>

                <ul className="list-disc pl-6 mt-3 text-sm">
                  {result.advice.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
