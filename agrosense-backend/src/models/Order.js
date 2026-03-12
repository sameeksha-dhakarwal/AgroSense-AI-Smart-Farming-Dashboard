import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

items:[
{
productId:String,
name:String,
price:Number,
quantity:Number
}
],

total:Number,

status:{
type:String,
default:"Pending"
}

},{timestamps:true});

export default mongoose.model("Order",OrderSchema);