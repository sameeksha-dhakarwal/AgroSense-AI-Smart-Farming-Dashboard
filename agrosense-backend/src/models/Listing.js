import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
{
  cropName: String,
  quantity: Number,
  unit: String,
  price: Number,
  description: String,

  seller:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  status:{
    type:String,
    default:"active"
  }

},
{timestamps:true}
);

export default mongoose.model("Listing",ListingSchema);