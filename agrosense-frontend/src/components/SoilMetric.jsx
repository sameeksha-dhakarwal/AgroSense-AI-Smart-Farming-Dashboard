export default function SoilMetric({ label, value, unit, status }) {
  const colors = {
    Low: "text-red-600 bg-red-50",
    Medium: "text-yellow-700 bg-yellow-50",
    Optimal: "text-green-700 bg-green-50",
  };

  return (
    <div className="border rounded-2xl p-4 bg-white">
      <div className="text-sm text-gray-500">{label}</div>

      <div className="flex items-center justify-between mt-2">
        <div className="text-2xl font-bold">
          {value}
          <span className="text-sm ml-1">{unit}</span>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full ${colors[status]}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
