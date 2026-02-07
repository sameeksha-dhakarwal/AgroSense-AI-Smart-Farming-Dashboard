export default function YieldPredictionCard({ value }) {
  if (value == null) {
    return (
      <div className="bg-white border rounded-2xl p-6">
        <h3 className="font-semibold">Predicted Yield</h3>
        <p className="text-sm text-gray-500 mt-2">
          Select a field to calculate yield
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-semibold mb-2">Predicted Yield</h3>

      <div className="text-4xl font-bold text-green-600">
        {value}%
      </div>

      <p className="text-sm text-gray-500 mt-2">
        AI-based estimate using NDVI, soil & weather
      </p>

      <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
        <div
          className="h-2 bg-green-600 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
