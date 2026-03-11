import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const discount =
    product.oldPrice
      ? Math.round(
          ((product.oldPrice - product.price) /
            product.oldPrice) *
            100
        )
      : null;

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">

      {/* Product Image */}
      <div
        className="relative cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="h-44 w-full object-cover hover:scale-105 transition"
        />
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-2">

        {/* Brand */}
        <div className="text-sm text-gray-500">
          {product.brand}
        </div>

        {/* Product Name */}
        <div
          onClick={() => navigate(`/product/${product.id}`)}
          className="font-semibold cursor-pointer hover:text-green-600"
        >
          {product.name}
        </div>

        {/* Price */}
        <div className="flex gap-2 items-center">

          <span className="text-lg font-bold">
            ₹{product.price}
          </span>

          {product.oldPrice && (
            <span className="line-through text-gray-400 text-sm">
              ₹{product.oldPrice}
            </span>
          )}

        </div>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}