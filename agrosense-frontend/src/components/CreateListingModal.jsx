import React, { useState } from "react";
import { X } from "lucide-react";

export default function CreateListingModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    unit: "Kilograms",
    price: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = () => {
    if (!form.name || !form.quantity || !form.price) return;

    onCreate(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[600px] rounded-2xl shadow-xl p-6 relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create New Listing</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">

          <div className="col-span-1">
            <label className="text-sm">Crop Name</label>
            <input
              name="name"
              placeholder="e.g., Rice"
              onChange={handleChange}
              className="w-full border rounded-xl p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm">Quantity</label>
            <input
              name="quantity"
              type="number"
              onChange={handleChange}
              className="w-full border rounded-xl p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm">Unit</label>
            <select
              name="unit"
              onChange={handleChange}
              className="w-full border rounded-xl p-2 mt-1"
            >
              <option>Kilograms</option>
              <option>Quintal</option>
              <option>Tons</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Price per Unit (₹)</label>
            <input
              name="price"
              type="number"
              onChange={handleChange}
              className="w-full border rounded-xl p-2 mt-1"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm">Description</label>
            <textarea
              name="description"
              placeholder="Describe your crop..."
              onChange={handleChange}
              className="w-full border rounded-xl p-2 mt-1"
            />
          </div>

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="px-4 py-2 bg-green-600 text-white rounded-xl"
          >
            Create Listing
          </button>
        </div>

      </div>
    </div>
  );
}