import React, { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import { getListings, createListing } from "../api";

export default function Marketplace() {

  const [listings,setListings] = useState([]);
  const [open,setOpen] = useState(false);

  const [form,setForm] = useState({
    cropName:"",
    quantity:0,
    unit:"Kilograms",
    price:0,
    description:""
  });

  useEffect(()=>{

    getListings().then(setListings);

  },[]);


  const submit = async ()=>{

    const res = await createListing(form);

    setListings([res,...listings]);

    setOpen(false);

  };

  return(

    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar/>

      <div className="flex-1">

        <Topbar/>

        <div className="p-6 space-y-6">

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
              onClick={()=>setOpen(true)}
              className="bg-green-600 text-white px-5 py-2 rounded-xl"
            >
              + Create Listing
            </button>

          </div>

          {/* LISTINGS */}

          <div className="space-y-4">

            {listings.map(item=>(
              <div
                key={item._id}
                className="bg-white p-5 rounded-xl border"
              >

                <div className="flex justify-between">

                  <div>

                    <div className="font-semibold text-lg">
                      {item.cropName}
                    </div>

                    <div className="text-gray-500">
                      {item.seller?.name}
                    </div>

                  </div>

                  <div className="text-green-600 font-bold">
                    ₹{item.price}
                  </div>

                </div>

                <div className="mt-3 text-sm text-gray-600">
                  Quantity {item.quantity} {item.unit}
                </div>

                <p className="mt-2 text-gray-600">
                  {item.description}
                </p>

                <button
                  className="mt-4 border px-4 py-2 rounded-lg"
                >
                  WhatsApp
                </button>

              </div>
            ))}

          </div>


          {/* CREATE LISTING MODAL */}

          {open && (

            <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

              <div className="bg-white p-6 rounded-xl w-[450px] space-y-3">

                <h2 className="font-bold text-lg">
                  Create New Listing
                </h2>

                <input
                  placeholder="Crop Name"
                  className="border p-2 rounded w-full"
                  onChange={e=>setForm({...form,cropName:e.target.value})}
                />

                <input
                  placeholder="Quantity"
                  type="number"
                  className="border p-2 rounded w-full"
                  onChange={e=>setForm({...form,quantity:e.target.value})}
                />

                <input
                  placeholder="Price per unit"
                  type="number"
                  className="border p-2 rounded w-full"
                  onChange={e=>setForm({...form,price:e.target.value})}
                />

                <textarea
                  placeholder="Description"
                  className="border p-2 rounded w-full"
                  onChange={e=>setForm({...form,description:e.target.value})}
                />

                <div className="flex justify-end gap-2">

                  <button
                    onClick={()=>setOpen(false)}
                    className="border px-4 py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={submit}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Create Listing
                  </button>

                </div>

              </div>

            </div>

          )}

        </div>
      </div>
    </div>
  );

}