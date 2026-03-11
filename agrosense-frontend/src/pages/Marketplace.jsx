import React from "react";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import ProductCard from "../components/ProductCard";
import CategoryGrid from "../components/CategoryGrid";

import { products } from "../data/products";

export default function Marketplace() {

  const [category, setCategory] = useState(null);

  const filteredProducts = category
    ? products.filter(p => p.category === category).slice(0, 6)
    : products.slice(0, 6);

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <div className="p-6 space-y-6">

          {/* SEARCH */}
          <div className="flex gap-3">
            <input
              placeholder="Search for products, brands, categories..."
              className="flex-1 border rounded-xl p-3"
            />

            <button className="border px-5 rounded-xl">
              Cart (0)
            </button>
          </div>

          {/* CATEGORIES */}
          <div>
            <h2 className="font-semibold mb-4 text-lg">
              Categories
            </h2>

            <CategoryGrid setCategory={setCategory} />
          </div>

          {/* PRODUCTS */}
          <div>
            <h2 className="font-semibold mb-4 text-lg">
              {category || "Today's Offers"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}