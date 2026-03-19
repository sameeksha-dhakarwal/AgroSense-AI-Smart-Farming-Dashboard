import React, { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CreateListingModal from "../components/CreateListingModal";

import { getListings, createListing, deleteListing } from "../api";

export default function Marketplace() {

  const [listings, setListings] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    getListings().then(setListings);
  }, []);

  const submit = async (formData) => {

    const res = await createListing(formData);

    setListings([res, ...listings]);

    setOpen(false);

    setToast("Listing created successfully");

    setTimeout(() => setToast(""), 3000);
  };

  /* 🗑 DELETE FUNCTION */
  const handleDelete = async (id) => {

    await deleteListing(id);

    setListings(listings.filter(item => item._id !== id));

    setToast("Listing deleted");

    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <div className="p-6 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-2xl font-bold">
                Marketplace
              </h1>
              <p className="text-gray-500">
                Connect directly with buyers and sellers
              </p>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="bg-green-600 text-white px-5 py-2 rounded-xl"
            >
              + Create Listing
            </button>

          </div>

          {/* LISTINGS */}

          <div className="space-y-4">

            {listings.map((item) => (

              <div
                key={item._id}
                className="bg-white border rounded-2xl p-5 flex justify-between"
              >

                {/* LEFT */}
                <div className="flex gap-4">

                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold">
                    {item.seller?.name?.[0] || "U"}
                  </div>

                  <div>

                    <div className="font-semibold text-lg capitalize">
                      {item.cropName}
                    </div>

                    <div className="text-gray-500 text-sm">
                      {item.seller?.name}
                    </div>

                    <div className="mt-2 text-sm">
                      Quantity{" "}
                      <b>
                        {item.quantity} {item.unit}
                      </b>
                    </div>

                    <p className="mt-1 text-gray-600 text-sm">
                      {item.description}
                    </p>

                    {/* ❌ REPLACED WHATSAPP WITH DELETE */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="mt-3 bg-red-500 text-white px-4 py-1 rounded-xl text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="text-right">

                  <div className="text-sm text-gray-500">
                    Price per {item.unit?.toLowerCase()}
                  </div>

                  <div className="text-green-600 font-bold text-lg">
                    ₹{item.price}.00
                  </div>

                  <div className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full inline-block">
                    active
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      </div>

      {/* MODAL */}
      {open && (
        <CreateListingModal
          onClose={() => setOpen(false)}
          onCreate={submit}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-white border shadow-lg rounded-xl p-4">
          <div className="font-semibold">Success</div>
          <div className="text-sm text-gray-500">
            {toast}
          </div>
        </div>
      )}

    </div>
  );
}