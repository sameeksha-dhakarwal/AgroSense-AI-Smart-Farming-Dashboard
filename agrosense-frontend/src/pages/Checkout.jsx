export default function Checkout(){

  return(

    <div className="p-10">

      <h1 className="text-xl font-bold mb-6">
        Checkout
      </h1>

      <input
        placeholder="Full Name"
        className="border p-3 w-full mb-4 rounded"
      />

      <input
        placeholder="Address"
        className="border p-3 w-full mb-4 rounded"
      />

      <button className="bg-green-600 text-white px-6 py-3 rounded">
        Place Order
      </button>

    </div>
  )
}