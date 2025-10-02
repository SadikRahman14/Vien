// controllers/cart.controller.js
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * POST /api/v1/cart/add
 * body: { itemId: string, size: string }
 */
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { itemId, size } = req.body;

  if (!itemId || !size) {
    throw new ApiError(400, "itemId and size are required");
  }

  const path = `cartData.${itemId}.${size}`;
  await User.updateOne({ _id: userId }, { $inc: { [path]: 1 } });

  const { cartData } = await User.findById(userId).select("cartData");
  return res.status(200).json(new ApiResponse(200, { cartData }, "Item added to cart"));
});


export const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { itemId, size, quantity } = req.body;

  if (!itemId || !size || typeof quantity !== "number") {
    throw new ApiError(400, "itemId, size and numeric quantity are required");
  }

  const path = `cartData.${itemId}.${size}`;

  if (quantity > 0) {
    await User.updateOne({ _id: userId }, { $set: { [path]: quantity } });
  } else {
    await User.updateOne({ _id: userId }, { $unset: { [path]: "" } });
    // optional cleanup if item becomes empty
    const doc = await User.findById(userId).select("cartData");
    if (doc?.cartData?.[itemId] && Object.keys(doc.cartData[itemId]).length === 0) {
      await User.updateOne({ _id: userId }, { $unset: { [`cartData.${itemId}`]: "" } });
    }
  }

  const { cartData } = await User.findById(userId).select("cartData");
  return res.status(200).json(new ApiResponse(200, { cartData }, "Cart updated"));
});

/**
 * GET /api/v1/cart
 * (no body)
 */
export const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId).select("cartData");
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, { cartData: user.cartData }, "Cart fetched"));
});


export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { itemId, size } = req.body;

  if (!itemId) throw new ApiError(400, "itemId is required");

  if (size) {
    const path = `cartData.${itemId}.${size}`;
    await User.updateOne({ _id: userId }, { $unset: { [path]: "" } });
  } else {
    await User.updateOne({ _id: userId }, { $unset: { [`cartData.${itemId}`]: "" } });
  }

  const doc = await User.findById(userId).select("cartData");
  if (doc?.cartData?.[itemId] && Object.keys(doc.cartData[itemId]).length === 0) {
    await User.updateOne({ _id: userId }, { $unset: { [`cartData.${itemId}`]: "" } });
  }

  const { cartData } = await User.findById(userId).select("cartData");
  return res.status(200).json(new ApiResponse(200, { cartData }, "Item removed"));
});


export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  await User.updateOne({ _id: userId }, { $set: { cartData: {} } });
  return res.status(200).json(new ApiResponse(200, { cartData: {} }, "Cart cleared"));
});
