import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { scanDisease } from "../api";

export default function DiseaseScanner() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const res = await scanDisease(file);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-5 max-w-4xl">
          <div className="bg-white border rounded-2xl p-6">
            <div className="font-bold text-lg">Crop Disease Scanner</div>

            <form onSubmit={submit} className="mt-4 space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="border p-3 rounded-xl w-full"
              />

              <button className="bg-green-600 text-white rounded-xl p-3 font-semibold">
                {loading ? "Scanning..." : "Scan Image"}
              </button>
            </form>

            {result && (
              <div className="mt-6 border-t pt-4">
                <div className="font-semibold">
                  Disease:{" "}
                  <span className="text-red-600">
                    {result.disease}
                  </span>
                </div>

                <div className="text-sm mt-1">
                  Severity: <b>{result.severity}</b>
                </div>

                <ul className="list-disc pl-6 mt-3 text-sm">
                  {result.treatment.map((t, i) => (
                    <li key={i}>{t}</li>
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
