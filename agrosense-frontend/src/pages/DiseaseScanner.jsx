import { useEffect, useState } from "react";
import { scanDisease } from "../api/disease";

/* =========================
   LocalStorage helpers
========================= */
const STORAGE_KEY = "recentDetections";

const loadRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveRecent = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default function DiseaseScanner() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState([]);

  /* Load recent detections on page load */
  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  const handleScan = async () => {
    if (!file) return;

    const res = await scanDisease(file);
    setResult(res);

    const newDetection = {
      image: URL.createObjectURL(file),
      result: res, // 🔥 store FULL result
      timestamp: Date.now(),
    };

    const updated = [newDetection, ...recent].slice(0, 5);
    setRecent(updated);
    saveRecent(updated);
  };

  const openRecent = (savedResult) => {
    setResult(savedResult);
  };

  const topConfidence = result?.predictions[0].confidence || 0;

  const severity =
    topConfidence > 80
      ? "High"
      : topConfidence > 50
      ? "Medium"
      : "Low";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Crop Disease Scanner</h1>

      {/* ================= Upload ================= */}
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <label className="block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer">
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <p className="font-medium">
            Drop leaf image here or click to upload
          </p>
          <p className="text-sm text-gray-500">
            JPG, PNG up to 10MB
          </p>
        </label>

        <button
          onClick={handleScan}
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Scan Image
        </button>
      </div>

      {/* ================= Tips ================= */}
      <div className="bg-gray-100 rounded-xl p-4">
        <p className="font-semibold mb-2">Tips for best results:</p>
        <ul className="text-sm text-gray-600 space-y-1 list-disc ml-5">
          <li>Take photos in good natural light</li>
          <li>Focus on the affected area clearly</li>
          <li>Avoid blurry or dark images</li>
          <li>Include the entire leaf or plant part</li>
        </ul>
      </div>

      {/* ================= Results ================= */}
      {result && (
        <div className="bg-white border rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-lg">
            🦠 {result.predictions[0].disease}
          </h3>

          {/* Confidence bar */}
          <div>
            <p className="text-sm mb-1">Confidence</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  topConfidence > 80
                    ? "bg-green-500"
                    : topConfidence > 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${topConfidence}%` }}
              />
            </div>
            <p className="mt-1 text-sm">
              ⚠️ Severity: {severity}
            </p>
          </div>

          {/* Top 3 predictions */}
          <div>
            <h4 className="font-semibold">Top Predictions</h4>
            <ul className="text-sm list-disc ml-5">
              {result.predictions.map((p, i) => (
                <li key={i}>
                  {p.disease} — {p.confidence}%
                </li>
              ))}
            </ul>
          </div>

          {/* Treatment */}
          <div>
            <h4 className="font-semibold">Treatment & Precautions</h4>
            <ul className="text-sm list-disc ml-5">
              {result.treatment.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ================= Recent Detections ================= */}
      {recent.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">
            Recent Detections
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recent.map((r, i) => (
              <div
                key={i}
                onClick={() => openRecent(r.result)}
                className="bg-white border rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-green-500 transition"
              >
                <img
                  src={r.image}
                  alt="leaf"
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <p className="font-medium">
                    {r.result.predictions[0].disease}
                  </p>
                  <p className="text-sm text-gray-500">
                    {r.result.predictions[0].confidence}% confidence
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
