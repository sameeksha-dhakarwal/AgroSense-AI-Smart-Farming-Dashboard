import React from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {

  const { addToCart } = useCart();

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

      <img
        src={product.image}
        className="h-44 w-full object-cover"
      />

      <div className="p-4 space-y-2">

        <div className="text-sm text-gray-500">
          {product.brand}
        </div>

        <div className="font-semibold">
          {product.name}
        </div>

        <div className="flex gap-2 items-center">

          <span className="text-lg font-bold">
            ₹{product.price}
          </span>

          <span className="line-through text-gray-400 text-sm">
            ₹{product.oldPrice}
          </span>

        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}