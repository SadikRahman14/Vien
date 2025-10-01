import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    addToCart,
    updateCart,
    getUserCart
} from "../controllers/cart.controller.js";


const router = Router();


router.route("/add-to-cart").post(verifyJWT, addToCart);
router.route("/update-cart").put(verifyJWT, updateCart);
router.route("/get-user-cart").get(verifyJWT, getUserCart);


export default router;