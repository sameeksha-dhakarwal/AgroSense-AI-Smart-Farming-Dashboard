import React, { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import ProductCard from "../components/ProductCard";
import CategoryGrid from "../components/CategoryGrid";

import { useCart } from "../context/CartContext";
import { getProducts } from "../api";

export default function Marketplace() {

  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cart } = useCart();

  /* Fetch products from backend */
  useEffect(() => {

    getProducts()
      .then((data) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setLoading(false);
      });

  }, []);

  /* Filter products by category */
  let filteredProducts = category
    ? products.filter(p => p.category === category)
    : products;

  /* Apply search */
  if (search.trim() !== "") {

    const term = search.toLowerCase();

    filteredProducts = filteredProducts.filter(p =>
      p.name?.toLowerCase().includes(term) ||
      p.brand?.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term)
    );

  }

  /* Limit to 6 products */
  filteredProducts = filteredProducts.slice(0, 6);

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
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCategory(null);
              }}
            />

            <button className="border px-5 rounded-xl flex items-center">
              Cart ({cart.length})
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

            {loading ? (

              <div className="text-gray-500">
                Loading products...
              </div>

            ) : filteredProducts.length === 0 ? (

              <div className="text-gray-500">
                No products found
              </div>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {filteredProducts.map(product => (

                  <ProductCard
                    key={product._id}
                    product={product}
                  />

                ))}

              </div>

            )}

          </div>

        </div>
      </div>
    </div>
  );
}