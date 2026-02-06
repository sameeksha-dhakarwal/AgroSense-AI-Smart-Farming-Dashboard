export default function SmartIrrigationCard({
  soilMoisture,
  advice,
}) {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <h3 className="font-semibold mb-2">
        Smart Irrigation Advice
      </h3>

      {soilMoisture == null ? (
        <p className="text-sm text-gray-500">
          Not enough data to generate advice.
        </p>
      ) : (
        <>
          <p className="text-sm font-medium text-green-700">
            {advice}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Based on crop type, soil moisture & weather
          </p>
        </>
      )}
    </div>
  );
}
