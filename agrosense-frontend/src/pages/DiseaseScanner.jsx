import { useEffect, useState } from "react";
import { scanDisease, getHistory } from "../api/disease";

export default function DiseaseScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* =========================
     Load user scan history
     ========================= */
  useEffect(() => {
    if (!token) return;

    getHistory(token)
      .then((data) => {
        if (Array.isArray(data)) {
          setRecent(data);
        }
      })
      .catch(() => {
        console.warn("Failed to load scan history");
      });
  }, [token]);

  /* =========================
     Handle file upload
     ========================= */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  /* =========================
     Scan image
     ========================= */
  const handleScan = async () => {
    if (!file) {
      alert("Please upload an image");
      return;
    }

    if (!token) {
      alert("Please login to scan diseases");
      return;
    }

    try {
      setLoading(true);

      const res = await scanDisease(file, token);
      setResult(res);

      // Reload history from backend (source of truth)
      const updatedHistory = await getHistory(token);
      setRecent(updatedHistory);
    } catch (err) {
      alert("Failed to scan image. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const main = result?.predictions?.[0];
  const severity =
    main?.confidence > 80
      ? "High"
      : main?.confidence > 50
      ? "Medium"
      : "Low";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Crop Disease Scanner</h1>

      {/* ================= Upload ================= */}
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <label className="block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer">
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
          <p className="font-medium">
            Drop leaf image here or click to upload
          </p>
          <p className="text-sm text-gray-500">
            JPG, PNG up to 10MB
          </p>
        </label>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-48 rounded-xl object-cover mx-auto"
          />
        )}

        <button
          onClick={handleScan}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Scanning..." : "Scan Image"}
        </button>
      </div>

      {/* ================= Tips ================= */}
      <div className="bg-gray-100 rounded-xl p-4">
        <p className="font-semibold mb-2">Tips for best results:</p>
        <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
          <li>Use good natural lighting</li>
          <li>Focus on affected area</li>
          <li>Avoid blurry images</li>
          <li>Include full leaf</li>
        </ul>
      </div>

      {/* ================= Result ================= */}
      {result && main && (
        <div className="bg-white border rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-bold">{main.disease}</h2>

          <p className="text-gray-600">{result.description}</p>

          {/* Confidence */}
          <div>
            <p className="text-sm mb-1">Confidence</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  main.confidence > 80
                    ? "bg-green-500"
                    : main.confidence > 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${main.confidence}%` }}
              />
            </div>
            <p className="mt-1 text-sm">
              ⚠️ Severity: {severity}
            </p>
          </div>

          {/* Plants */}
          <p className="text-sm">
            🌱 Affects:{" "}
            <strong>{result.plants.join(", ")}</strong>
          </p>

          {/* Treatment */}
          <div>
            <h4 className="font-semibold">Treatment & Precautions</h4>
            <ul className="list-disc ml-5 text-sm">
              {result.treatment.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          {/* Similar diseases */}
          <div>
            <h4 className="font-semibold">Similar Diseases</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              {result.predictions.slice(1).map((p, i) => (
                <div key={i} className="border rounded-xl p-3">
                  <p className="font-medium">{p.disease}</p>
                  <p className="text-sm text-gray-500">
                    {p.confidence}% confidence
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= Recent ================= */}
      {recent.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Recent Detections</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recent.map((r) => (
              <div
                key={r.id}
                onClick={() => setResult(r.result)}
                className="cursor-pointer bg-white border rounded-xl overflow-hidden hover:shadow"
              >
                {r.image && (
                  <img
                    src={r.image}
                    alt=""
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-3">
                  <p className="font-medium">
                    {r.result?.predictions?.[0]?.disease}
                  </p>
                  <p className="text-sm text-gray-500">
                    {r.result?.predictions?.[0]?.confidence}% confidence
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
