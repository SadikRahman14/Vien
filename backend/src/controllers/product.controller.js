import {asyncHandler} from "../utils/asyncHandler.js"
import validator from "validator"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {Product } from "../models/product.model.js"


const addProduct = asyncHandler(async (req, res) => { 
    const { name, description, price, category, subCategory, sizes, bestSeller } = req.body

    if (
        [name, description, category, subCategory].some(
            field => !field || field.trim() === ""
        ) || price == null
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const image1 = req.files?.image1?.[0]?.path;
    const image2 = req.files?.image2?.[0]?.path;
    const image3 = req.files?.image3?.[0]?.path;
    const image4 = req.files?.image4?.[0]?.path;

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    const uploadedImages = await Promise.all(images.map((image) => uploadOnCloudinary(image)));

    const product = await Product.create({
        name,
        description,
        price: Number(price),
        category,
        subCategory,
        sizes: JSON.parse(sizes),
        bestSeller: bestSeller === "true" ? true : false,
        images: uploadedImages,
        date: Date.now()
    });

    if (!product) {
        throw new ApiError(500, "Product creation failed");
    }

    return res.status(201)
    .json(
        new ApiResponse(201, "Product created successfully", product)
    )
});

const removeProduct = asyncHandler(async (req, res) => { 
    const { productId } = req.params;

    const product = await Product.findById(productId);

    await Product.deleteOne(product)

    return res.status(200)
    .json(
        new ApiResponse(200, "Product removed successfully", {})
    )

})

const getAllProducts = asyncHandler(async (req, res) => { 
    const products = await Product.find({});

    if(!products){
        throw new ApiError(404, "No products found");
    }

    return res.status(200)
    .json(
        new ApiResponse(200, "Products fetched successfully", products)
    )
})
 
const getSingleProduct = asyncHandler(async (req, res) => { 
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if(!product){
        throw new ApiError(404, "Product not found");
    }

    return res.status(200)
    .json(
        new ApiResponse(200, "Product fetched successfully", product)
    )
})
 
export {
    addProduct,
    removeProduct,
    getAllProducts,
    getSingleProduct
}