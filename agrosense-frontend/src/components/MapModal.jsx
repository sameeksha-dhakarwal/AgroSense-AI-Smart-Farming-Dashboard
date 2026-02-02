export default function MapModal({ field, onClose }) {
  const { latitude, longitude } = field.location;

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center">
      <div className="bg-white rounded-2xl p-4 w-[90%] max-w-3xl">
        <iframe
          title="map"
          width="100%"
          height="400"
          src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
        />
        <button onClick={onClose} className="mt-3 text-sm text-green-700">
          Close
        </button>
      </div>
    </div>
  );
}
