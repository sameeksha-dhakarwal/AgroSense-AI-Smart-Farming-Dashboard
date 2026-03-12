import { useCart } from "../context/CartContext";
import { authApi } from "../api";

export default function Checkout() {

  const { cart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {

    try {

      const res = await authApi(
        "/api/orders",
        "POST",
        {
          items: cart,
          total: total
        }
      );

      alert("Order placed successfully");

      console.log(res);

    } catch (err) {

      console.error(err);
      alert("Order failed");

    }

  };

  return (
    <div className="p-10">

      <h1 className="text-xl font-bold mb-6">
        Checkout
      </h1>

      <button
        onClick={placeOrder}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Place Order
      </button>

    </div>
  );
}