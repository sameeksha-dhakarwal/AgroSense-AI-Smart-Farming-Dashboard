import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <main className="p-6">

          <h2 className="text-xl font-bold mb-4">
            Today's Offers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

          </div>

        </main>

      </div>

    </div>
  );
}