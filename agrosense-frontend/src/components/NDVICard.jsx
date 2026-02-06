export default function NDVICard({ ndvi }) {
  if (ndvi == null) return null;

  const status =
    ndvi < 0.2
      ? "Poor"
      : ndvi < 0.4
      ? "Fair"
      : ndvi < 0.6
      ? "Good"
      : "Excellent";

  const color =
    ndvi < 0.2
      ? "bg-red-500"
      : ndvi < 0.4
      ? "bg-orange-500"
      : ndvi < 0.6
      ? "bg-yellow-500"
      : "bg-green-600";

  return (
    <div className="bg-white border rounded-2xl p-6">
      <div className="text-sm text-gray-500">
        NDVI Index
      </div>

      <div className="text-3xl font-bold mt-2">
        {ndvi}
      </div>

      <div className="mt-3 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${ndvi * 100}%` }}
        />
      </div>

      <div className="text-sm mt-2 text-gray-600">
        Vegetation health:{" "}
        <span className="font-medium">
          {status}
        </span>
      </div>
    </div>
  );
}
