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
     Load History
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
     Handle File Upload
     ========================= */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  /* =========================
     Scan Image
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

      const updatedHistory = await getHistory(token);
      setRecent(updatedHistory);
    } catch (err) {
      alert("Failed to scan image.");
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

      {/* ================= Upload Section ================= */}
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

      {/* ================= Tips Section ================= */}
      <div className="bg-gray-100 rounded-xl p-4">
        <p className="font-semibold mb-2">Tips for best results:</p>
        <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
          <li>Take photos in good natural light</li>
          <li>Focus clearly on the affected area</li>
          <li>Avoid blurry or dark images</li>
          <li>Include the entire leaf or plant part</li>
        </ul>
      </div>

      {/* ================= Result Section ================= */}
      {result && main && (
        <div className="bg-white border rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-bold">{main.disease}</h2>

          <p className="text-gray-600">{result.description}</p>

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

          {result.plants?.length > 0 && (
            <p className="text-sm">
              🌱 Affects: <strong>{result.plants.join(", ")}</strong>
            </p>
          )}

          <div>
            <h4 className="font-semibold">Treatment & Precautions</h4>
            <ul className="list-disc ml-5 text-sm">
              {result.treatment?.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ================= Recent Detections ================= */}
      {recent.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Recent Detections</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((r) => {
              const disease = r.result?.predictions?.[0];
              const isHealthy =
                disease?.disease?.toLowerCase().includes("healthy");

              return (
                <div
                  key={r._id}
                  className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  {r.image && (
                    <img
                      src={r.image}
                      alt=""
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">
                        {disease?.disease}
                      </h4>

                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          isHealthy
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {isHealthy ? "Healthy" : "Disease"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      {r.result?.description}
                    </p>

                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium">
                        View Treatment & Precautions
                      </summary>
                      <ul className="list-disc ml-5 mt-2 space-y-1">
                        {r.result?.treatment?.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </details>

                    <div className="text-sm text-gray-500">
                      Confidence: {disease?.confidence}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}