import { MapPin } from "lucide-react";

export default function FieldCard({ field, onMap }) {
  return (
    <div className="border rounded-2xl p-4 bg-white relative">
      <button
        onClick={() => onMap(field)}
        className="absolute top-3 right-3 text-gray-500 hover:text-green-600"
      >
        <MapPin size={18} />
      </button>

      <h3 className="font-semibold">{field.name}</h3>
      <div className="text-sm text-gray-600">Area: {field.area} acres</div>
      <div className="text-sm">Crop: {field.crop}</div>
      <div className="text-xs text-gray-500">{field.location.address}</div>
    </div>
  );
}
