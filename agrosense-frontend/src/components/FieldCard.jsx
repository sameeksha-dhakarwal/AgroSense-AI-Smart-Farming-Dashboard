import { MapPin, Pencil, Trash2, CheckCircle } from "lucide-react";
import { setActiveField, getActiveField } from "../utils/activeField";

export default function FieldCard({ field, onMap, onEdit, onDelete }) {
  if (!field) return null;

  const activeField = getActiveField();
  const isActive = activeField?._id === field._id;

  const selectField = () => {
    setActiveField(field);
    window.dispatchEvent(new Event("active-field-changed"));
  };

  return (
    <div
      onClick={selectField}
      className={`border rounded-2xl p-4 bg-white relative cursor-pointer transition
        ${isActive ? "border-green-600 ring-1 ring-green-500" : "hover:border-green-400"}
      `}
    >
      {isActive && (
        <CheckCircle
          size={18}
          className="absolute top-3 left-3 text-green-600"
        />
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onMap(field);
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-green-600"
      >
        <MapPin size={18} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(field);
        }}
        className="absolute top-3 right-10 text-gray-500 hover:text-blue-600"
      >
        <Pencil size={16} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(field._id);
        }}
        className="absolute top-3 right-16 text-gray-500 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>

      <h3 className="font-semibold mt-4">{field.name}</h3>

      <div className="text-sm text-gray-600">🌱 {field.crop}</div>
      <div className="text-sm text-gray-600">📐 {field.area} acres</div>

      <div className="text-xs text-gray-500 mt-1">
        {field.location?.address}
      </div>
    </div>
  );
}
