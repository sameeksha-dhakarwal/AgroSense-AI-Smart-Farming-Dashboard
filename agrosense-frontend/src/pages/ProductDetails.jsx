import { useParams } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ProductDetails(){

  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find(
    p => p.id === Number(id)
  );

  if(!product) return <div>Product not found</div>;

  return (

    <div className="p-10">

      <div className="grid grid-cols-2 gap-10">

        <img
          src={product.image}
          className="rounded-xl"
        />

        <div>

          <h1 className="text-2xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-lg mb-4">
            ₹{product.price}
          </p>

          <button
            onClick={()=>addToCart(product)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>

  );
}