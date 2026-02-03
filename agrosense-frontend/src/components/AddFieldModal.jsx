import { useState, useEffect } from "react";
import { authApi } from "../api";

export default function AddFieldModal({ onClose, onAdded, field }) {
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

  /* Prefill when editing */
  useEffect(() => {
    if (field) {
      setForm({
        name: field.name || "",
        area: field.area || "",
        crop: field.crop || "",
        soilType: field.soilType || "",
        latitude: field.location?.latitude || "",
        longitude: field.location?.longitude || "",
        address: field.location?.address || "",
      });
    }
  }, [field]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* 🌍 Use current GPS location */
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
      },
      () => alert("Location permission denied")
    );
  };

  /* 📍 Fetch address from lat/lng */
  const fetchLocation = async () => {
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
    } catch {
      alert("Failed to fetch location");
    }
  };

  /* Save (Add / Edit) */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        area: Number(form.area),
        crop: form.crop,
        soilType: form.soilType,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        address: form.address,
      };

      if (field) {
        await authApi(`/api/fields/${field._id}`, "PUT", payload);
      } else {
        await authApi("/api/fields", "POST", payload);
      }

      onAdded();
      onClose();
    } catch {
      alert("Failed to save field");
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
        <h2 className="text-xl font-bold">
          {field ? "Edit Field" : "Add New Field"}
        </h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Field Name"
          className="border p-3 rounded-xl w-full"
        />

        <input
          name="area"
          value={form.area}
          onChange={handleChange}
          placeholder="Area (acres)"
          className="border p-3 rounded-xl w-full"
        />

        <input
          name="crop"
          value={form.crop}
          onChange={handleChange}
          placeholder="Current Crop"
          className="border p-3 rounded-xl w-full"
        />

        <input
          name="soilType"
          value={form.soilType}
          onChange={handleChange}
          placeholder="Soil Type"
          className="border p-3 rounded-xl w-full"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            placeholder="Latitude"
            className="border p-3 rounded-xl"
          />
          <input
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            placeholder="Longitude"
            className="border p-3 rounded-xl"
          />
        </div>

        {/* LOCATION ACTIONS */}
        <div className="flex gap-4 text-sm font-medium">
          <button
            type="button"
            onClick={detectLocation}
            className="text-green-700"
          >
            Use current location
          </button>

          <button
            type="button"
            onClick={fetchLocation}
            className="text-blue-700"
          >
            📍 Fetch location
          </button>
        </div>

        {form.address && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            {form.address}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold"
          >
            {loading ? "Saving..." : "Save"}
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
