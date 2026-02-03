import { MapPin, Pencil, Trash2, CheckCircle } from "lucide-react";
import { setActiveField, getActiveField } from "../utils/activeField";

export default function FieldCard({ field, onMap, onEdit, onDelete }) {
  // 🔒 Guard (VERY IMPORTANT)
  if (!field) return null;

  const activeField = getActiveField();
  const isActive = activeField?._id === field._id;

  const selectField = () => {
    setActiveField(field);
  };

  return (
    <div
      onClick={selectField}
      className={`relative cursor-pointer rounded-2xl border bg-white p-4 transition
        ${
          isActive
            ? "border-green-600 ring-1 ring-green-500"
            : "hover:border-green-400"
        }
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <CheckCircle
          size={18}
          className="absolute top-3 left-3 text-green-600"
        />
      )}

      {/* Map */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMap(field);
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-green-600"
        title="View on map"
      >
        <MapPin size={18} />
      </button>

      {/* Edit */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(field);
        }}
        className="absolute top-3 right-10 text-gray-500 hover:text-blue-600"
        title="Edit field"
      >
        <Pencil size={16} />
      </button>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(field._id);
        }}
        className="absolute top-3 right-16 text-gray-500 hover:text-red-600"
        title="Delete field"
      >
        <Trash2 size={16} />
      </button>

      <h3 className="mt-4 font-semibold">{field.name}</h3>

      <div className="mt-1 text-sm text-gray-600">
        🌱 {field.crop}
      </div>

      <div className="text-sm text-gray-600">
        📐 {field.area} acres
      </div>

      <div className="mt-1 text-xs text-gray-500">
        {field.location?.address}
      </div>
    </div>
  );
}
