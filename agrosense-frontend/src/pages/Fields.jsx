import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { authApi } from "../api";

export default function Fields() {
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({
    name: "",
    crop: "",
    location: "",
    area: "",
  });

  const loadFields = async () => {
    const res = await authApi("/api/fields");
    setFields(res);
  };

  useEffect(() => {
    loadFields();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await authApi("/api/fields", "POST", form);
    setForm({ name: "", crop: "", location: "", area: "" });
    loadFields();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-5 space-y-5">
          {/* Add field */}
          <div className="rounded-2xl bg-white border p-5">
            <div className="font-bold text-lg">Add New Field</div>

            <form className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4" onSubmit={submit}>
              <input
                placeholder="Field Name"
                className="border p-3 rounded-xl"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Crop"
                className="border p-3 rounded-xl"
                value={form.crop}
                onChange={(e) => setForm({ ...form, crop: e.target.value })}
              />
              <input
                placeholder="Location"
                className="border p-3 rounded-xl"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <input
                placeholder="Area (acres)"
                className="border p-3 rounded-xl"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
              />

              <button className="bg-green-600 text-white rounded-xl p-3 font-semibold md:col-span-4">
                Add Field
              </button>
            </form>
          </div>

          {/* Fields list */}
          <div className="rounded-2xl bg-white border p-5">
            <div className="font-bold text-lg mb-3">My Fields</div>

            {fields.length === 0 && (
              <div className="text-sm text-gray-500">No fields added yet.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fields.map((f) => (
                <div key={f._id} className="border rounded-2xl p-4">
                  <div className="font-bold">{f.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    🌱 {f.crop}
                  </div>
                  <div className="text-sm text-gray-600">
                    📍 {f.location}
                  </div>
                  <div className="text-sm text-gray-600">
                    📐 {f.area} acres
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
