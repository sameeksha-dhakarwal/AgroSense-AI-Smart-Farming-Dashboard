export default function RecentDetections({ items }) {
  if (!items.length) return null;

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">Recent Detections</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-white border rounded-xl p-3 flex gap-3"
          >
            <img
              src={item.image}
              alt="leaf"
              className="w-20 h-20 object-cover rounded-md"
            />

            <div className="flex-1">
              <p className="font-medium">{item.disease}</p>
              <p className="text-sm text-gray-500">
                Confidence: {item.confidence}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
