import express from "express";

import auth from "../middleware/auth.js";

import {
createOrder,
getOrders
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/",auth,createOrder);

router.get("/",auth,getOrders);

export default router;