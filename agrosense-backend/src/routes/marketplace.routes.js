import express from "express";
import auth from "../middleware/auth.js";

import {
  createListing,
  getListings
} from "../controllers/marketplace.controller.js";

/* ✅ IMPORT MODEL (needed for delete) */
import Listing from "../models/Listing.js";

const router = express.Router();

/* EXISTING ROUTES */
router.get("/", getListings);
router.post("/", auth, createListing);

/* 🗑 DELETE LISTING */
router.delete("/:id", auth, async (req, res) => {
  try {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    /* 🔒 OPTIONAL: Only owner can delete */
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Not authorized to delete this listing"
      });
    }

    await listing.deleteOne();

    res.json({
      message: "Listing deleted successfully"
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);

    res.status(500).json({
      error: "Delete failed"
    });
  }
});

export default router;