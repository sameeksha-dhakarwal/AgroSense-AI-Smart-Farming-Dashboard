import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useCart } from "../context/CartContext";

export default function CartPage() {

  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <div className="p-6">

          <h1 className="text-xl font-semibold mb-6">
            Your Cart
          </h1>

          {cart.length === 0 && (
            <div className="text-gray-500 space-y-3">

              <p>Your cart is empty</p>

              <button
                onClick={() => navigate("/ecommerce")}
                className="bg-green-600 text-white px-5 py-2 rounded-xl"
              >
                Continue Shopping
              </button>

            </div>
          )}

          <div className="space-y-4">

            {cart.map((item) => (

              <div
                key={item._id}
                className="flex items-center justify-between bg-white p-4 border rounded-xl"
              >

                <div className="flex gap-4 items-center">

                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div>

                    <div className="font-medium">
                      {item.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      ₹{item.price}
                    </div>

                  </div>

                </div>

                <div className="flex items-center gap-5">

                  <div className="text-sm">
                    Qty: {item.quantity}
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

          {cart.length > 0 && (

            <div className="mt-8 bg-white border p-6 rounded-xl space-y-4">

              <div className="flex justify-between text-lg">

                <span className="font-medium">
                  Total
                </span>

                <span className="font-bold">
                  ₹{total}
                </span>

              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="bg-green-600 text-white px-6 py-3 rounded-xl w-full hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </button>

            </div>

          )}

        </div>
      </div>
    </div>
  );
}