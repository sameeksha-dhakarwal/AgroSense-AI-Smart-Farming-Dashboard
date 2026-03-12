import Order from "../models/Order.js";

export const createOrder = async(req,res)=>{

try{

const order = await Order.create({

user:req.user._id,
items:req.body.items,
total:req.body.total

});

res.json(order);

}catch(err){

res.status(500).json({message:"Order failed"});

}
};

export const getOrders = async(req,res)=>{

const orders = await Order.find({
user:req.user._id
});

res.json(orders);
};