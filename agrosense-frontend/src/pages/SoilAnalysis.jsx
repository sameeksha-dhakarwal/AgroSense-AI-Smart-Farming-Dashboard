import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { analyzeSoil } from "../api";

export default function SoilAnalysis() {
  const [form, setForm] = useState({
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    moisture: "",
  });
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const res = await analyzeSoil(form);
    setResult(res);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-5 max-w-4xl">
          <div className="bg-white border rounded-2xl p-6">
            <div className="font-bold text-lg">Soil Analysis</div>

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {Object.keys(form).map((key) => (
                <input
                  key={key}
                  className="border p-3 rounded-xl"
                  placeholder={key.toUpperCase()}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  required
                />
              ))}

              <button className="bg-green-600 text-white rounded-xl p-3 font-semibold md:col-span-3">
                Analyze Soil
              </button>
            </form>

            {result && (
              <div className="mt-6 border-t pt-4">
                <div className="font-semibold">
                  Soil Status:{" "}
                  <span className="text-green-700">{result.status}</span>
                </div>

                <ul className="list-disc pl-6 mt-3 text-sm">
                  {result.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
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
