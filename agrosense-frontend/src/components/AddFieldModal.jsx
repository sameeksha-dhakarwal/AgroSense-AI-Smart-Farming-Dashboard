import { useState } from "react";
import { authApi } from "../api";

export default function AddFieldModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    name: "",
    area: "",
    crop: "",
    soilType: "",
    latitude: "",
    longitude: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 FIX 1: prevent default + async
  const fetchLocation = async (e) => {
    e.preventDefault();

    if (!form.latitude || !form.longitude) {
      alert("Please enter latitude and longitude");
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${form.latitude}&lon=${form.longitude}`
      );
      const data = await res.json();

      if (data.display_name) {
        setForm((prev) => ({
          ...prev,
          address: data.display_name,
        }));
      } else {
        alert("Location not found");
      }
    } catch (err) {
      alert("Failed to fetch location");
    }
  };

  // 🔹 FIX 2: use authApi (token included)
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi("/api/fields", "POST", {
        name: form.name,
        area: Number(form.area),
        crop: form.crop,
        soilType: form.soilType,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        address: form.address,
      });

      onAdded();
      onClose();
    } catch (err) {
      alert("Failed to add field");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-3"
      >
        <h2 className="text-xl font-bold">Add New Field</h2>

        <input
          name="name"
          placeholder="Field Name"
          className="border p-3 rounded-xl w-full"
          onChange={handleChange}
        />

        <input
          name="area"
          placeholder="Area (acres)"
          className="border p-3 rounded-xl w-full"
          onChange={handleChange}
        />

        <input
          name="crop"
          placeholder="Current Crop"
          className="border p-3 rounded-xl w-full"
          onChange={handleChange}
        />

        <input
          name="soilType"
          placeholder="Soil Type"
          className="border p-3 rounded-xl w-full"
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            name="latitude"
            placeholder="Latitude"
            className="border p-3 rounded-xl"
            onChange={handleChange}
          />
          <input
            name="longitude"
            placeholder="Longitude"
            className="border p-3 rounded-xl"
            onChange={handleChange}
          />
        </div>

        <button
          type="button"
          onClick={fetchLocation}
          className="text-sm text-green-700 font-medium"
        >
          📍 Fetch Location
        </button>

        {form.address && (
          <div className="text-xs text-gray-600">
            {form.address}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold disabled:opacity-60"
          >
            {loading ? "Saving..." : "Add Field"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 border rounded-xl py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
