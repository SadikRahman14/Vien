import { Router } from "express";
import {
    addProduct,
    removeProduct,
    getAllProducts,
    getSingleProduct
} from "../controllers/product.controller.js"

const router = Router();


export default router;