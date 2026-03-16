import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useCart } from "../context/CartContext";

export default function Checkout() {

  const { cart, clearCart } = useCart();

  const total = cart.reduce(
    (sum,item)=>sum + item.price * item.quantity,
    0
  );

  const placeOrder = () => {

    alert("Order placed successfully!");

    clearCart();

  };

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <div className="p-6 max-w-xl">

          <h1 className="text-xl font-semibold mb-6">
            Checkout
          </h1>

          <div className="bg-white border p-6 rounded-xl">

            <div className="flex justify-between mb-4">
              <span>Total Amount</span>
              <span className="font-bold">₹{total}</span>
            </div>

            <button
              onClick={placeOrder}
              className="bg-green-600 text-white px-6 py-3 rounded-xl w-full"
            >
              Place Order
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}