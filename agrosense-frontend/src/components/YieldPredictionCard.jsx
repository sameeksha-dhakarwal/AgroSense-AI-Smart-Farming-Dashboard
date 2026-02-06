export default function YieldPredictionCard({ value }) {
  if (value == null) return null;

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-semibold">
        Predicted Yield
      </h3>

      <div className="text-4xl font-bold text-green-600 mt-2">
        {value}%
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Based on NDVI, moisture & weather
      </p>
    </div>
  );
}
