import { Router } from "express";
import {
    placeOrderCOD,
    placeOrderRazoprPay,
    placeOrderStripe,
    getAllOrders,
    getAllUserOrders,
    updateOrderStatus
} from "../controllers/order.controller.js"
import { verifyJWT, verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();


// Admin
router.route("/get-all-orders").get(verifyAdmin, getAllOrders)
router.route("/update-status").post(verifyAdmin, updateOrderStatus)

// Payment
router.route("/place-order-cod").post(verifyJWT, placeOrderCOD)
router.route("/place-order-razorpay").post(verifyJWT, placeOrderRazoprPay)
router.route("/place-order-stripe").post(verifyJWT, placeOrderStripe)

// User 
router.route("/get-user-order").get(verifyJWT, getAllUserOrders)

export default router;

