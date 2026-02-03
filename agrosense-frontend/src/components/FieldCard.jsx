import { MapPin, Pencil, Trash2 } from "lucide-react";

export default function FieldCard({ field, onMap, onEdit, onDelete }) {
  return (
    <div className="border rounded-2xl p-4 bg-white relative">
      {/* Map pin */}
      <button
        onClick={() => onMap(field)}
        className="absolute top-3 right-3 text-gray-500 hover:text-green-600"
        title="View on map"
      >
        <MapPin size={18} />
      </button>

      {/* Edit */}
      <button
        onClick={() => onEdit(field)}
        className="absolute top-3 right-10 text-gray-500 hover:text-blue-600"
        title="Edit field"
      >
        <Pencil size={16} />
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(field._id)}
        className="absolute top-3 right-16 text-gray-500 hover:text-red-600"
        title="Delete field"
      >
        <Trash2 size={16} />
      </button>

      <h3 className="font-semibold">{field.name}</h3>

      <div className="text-sm text-gray-600 mt-1">
        🌱 {field.crop}
      </div>

      <div className="text-sm text-gray-600">
        📐 {field.area} acres
      </div>

      <div className="text-xs text-gray-500 mt-1">
        {field.location?.address}
      </div>
    </div>
  );
}
