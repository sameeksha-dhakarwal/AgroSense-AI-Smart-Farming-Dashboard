import Listing from "../models/Listing.js";

export const createListing = async (req,res)=>{

  try{

    const listing = await Listing.create({
      ...req.body,
      seller:req.user._id
    });

    res.json(listing);

  }catch(err){
    res.status(500).json({message:"Failed to create listing"});
  }

};


export const getListings = async (req,res)=>{

  const listings = await Listing.find()
  .populate("seller","name");

  res.json(listings);

};