import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { authApi, addReading } from "../api";

export default function ManualEntry() {
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({
    field: "",
    soilMoisture: "",
    temperature: "",
    humidity: "",
    rainfall: "",
  });

  useEffect(() => {
    authApi("/api/fields").then(setFields);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await addReading(form);
    alert("Reading added successfully");
    setForm({
      field: "",
      soilMoisture: "",
      temperature: "",
      humidity: "",
      rainfall: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-5">
          <div className="rounded-2xl bg-white border p-6 max-w-3xl">
            <div className="font-bold text-lg">Manual Sensor Entry</div>

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <select
                className="border p-3 rounded-xl"
                value={form.field}
                onChange={(e) => setForm({ ...form, field: e.target.value })}
                required
              >
                <option value="">Select Field</option>
                {fields.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name}
                  </option>
                ))}
              </select>

              <input className="border p-3 rounded-xl" placeholder="Soil Moisture (%)"
                value={form.soilMoisture}
                onChange={(e) => setForm({ ...form, soilMoisture: e.target.value })}
              />
              <input className="border p-3 rounded-xl" placeholder="Temperature (°C)"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: e.target.value })}
              />
              <input className="border p-3 rounded-xl" placeholder="Humidity (%)"
                value={form.humidity}
                onChange={(e) => setForm({ ...form, humidity: e.target.value })}
              />
              <input className="border p-3 rounded-xl" placeholder="Rainfall (mm)"
                value={form.rainfall}
                onChange={(e) => setForm({ ...form, rainfall: e.target.value })}
              />

              <button className="bg-green-600 text-white rounded-xl p-3 font-semibold md:col-span-2">
                Save Reading
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
