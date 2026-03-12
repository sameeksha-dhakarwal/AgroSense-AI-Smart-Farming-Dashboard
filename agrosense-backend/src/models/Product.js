import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
{
name: {
type: String,
required: true
},

brand: String,

price: Number,

oldPrice: Number,

category: String,

image: String,

stock: {
type: Number,
default: 100
}

},
{ timestamps: true }
);

export default mongoose.model("Product", ProductSchema);