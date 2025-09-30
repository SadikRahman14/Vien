import { Router } from "express";
import {
    addProduct,
    removeProduct,
    getAllProducts,
    getSingleProduct
} from "../controllers/product.controller.js"
import { upload } from "../middleware/multer.mddleware.js";
import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();



router.route("/remove-product/:productId").delete(verifyAdmin, removeProduct);
router.route("/get-single-product/:productId").get(getSingleProduct);

router.route("/add-product").post(
    verifyAdmin,
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 }
    ]),
    addProduct
);
router.route("/get-all-products").get(getAllProducts);




export default router;