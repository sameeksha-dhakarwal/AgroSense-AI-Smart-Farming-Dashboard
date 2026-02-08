export default function DiseaseResultCard({ prediction, treatment }) {
  const severity =
    prediction.confidence > 80
      ? "High"
      : prediction.confidence > 50
      ? "Medium"
      : "Low";

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">
            {prediction.disease}
          </h3>
          <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600">
            Disease
          </span>
        </div>

        {/* Confidence Bar */}
        <div>
          <p className="text-sm">Confidence</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                prediction.confidence > 80
                  ? "bg-green-500"
                  : prediction.confidence > 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
          <p className="text-sm mt-1">
            ⚠️ Severity: {severity}
          </p>
        </div>

        {/* Treatment */}
        <details className="text-sm">
          <summary className="cursor-pointer font-medium">
            View Treatment & Precautions
          </summary>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {treatment.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}
