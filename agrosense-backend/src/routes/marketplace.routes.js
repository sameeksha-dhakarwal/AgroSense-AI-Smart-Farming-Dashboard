import express from "express";
import auth from "../middleware/auth.js";

import {
createListing,
getListings
} from "../controllers/marketplace.controller.js";

const router = express.Router();

router.get("/",getListings);
router.post("/",auth,createListing);

export default router;