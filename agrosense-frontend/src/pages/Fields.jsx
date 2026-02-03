import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import FieldCard from "../components/FieldCard";
import AddFieldModal from "../components/AddFieldModal";
import MapModal from "../components/MapModal";
import { getFields, authApi } from "../api";

export default function Fields() {
  const [fields, setFields] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editField, setEditField] = useState(null);
  const [mapField, setMapField] = useState(null);

  const loadFields = async () => {
    try {
      const res = await getFields();
      setFields(res || []);
    } catch (err) {
      console.error("Failed to load fields", err);
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  /* 🗑️ Delete field */
  const deleteField = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this field?");
    if (!ok) return;

    try {
      await authApi(`/api/fields/${id}`, "DELETE");
      loadFields();
    } catch {
      alert("Failed to delete field");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6 space-y-6">
          {/* ===== Header ===== */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Fields</h1>
              <p className="text-sm text-gray-500">
                Manage your agricultural fields and monitor their status
              </p>
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
            >
              + Add Field
            </button>
          </div>

          {/* ===== Fields Grid ===== */}
          {fields.length === 0 ? (
            <div className="text-sm text-gray-500">
              No fields added yet.
            </div>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {fields.map((field) => (
                <FieldCard
                  key={field._id}
                  field={field}
                  onMap={setMapField}
                  onEdit={setEditField}
                  onDelete={deleteField}
                />
              ))}
            </section>
          )}
        </main>
      </div>

      {/* ===== ADD FIELD ===== */}
      {showAdd && (
        <AddFieldModal
          onClose={() => setShowAdd(false)}
          onAdded={loadFields}
        />
      )}

      {/* ===== EDIT FIELD ===== */}
      {editField && (
        <AddFieldModal
          field={editField}
          onClose={() => setEditField(null)}
          onAdded={loadFields}
        />
      )}

      {/* ===== MAP MODAL ===== */}
      {mapField && (
        <MapModal
          field={mapField}
          onClose={() => setMapField(null)}
        />
      )}
    </div>
  );
}
