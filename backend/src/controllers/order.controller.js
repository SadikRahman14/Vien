import { asyncHandler } from '../utils/asyncHandler.js';
import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {
  getRequestedProductIds,
  assertQuotedAmountMatches,
  priceOrderFromProducts,
  validateDeliveryAddress
} from '../utils/order-pricing.js';

const placeOrderCOD = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, 'Authentication required');

  const { items: requestedItems, address, amount: displayedAmount } = req.body || {};
  const productIds = getRequestedProductIds(requestedItems);
  const deliveryAddress = validateDeliveryAddress(address);

  // Query current prices and supported sizes directly from MongoDB.
  const products = await Product.find({ _id: { $in: productIds } })
    .select('_id name price sizes images')
    .lean();
  const { items, amount } = priceOrderFromProducts(requestedItems, products);

  // The browser's quoted total is only a consistency check, never the saved price.
  assertQuotedAmountMatches(displayedAmount, amount);

  const order = await Order.create({
    userId,
    items,
    address: deliveryAddress,
    amount,
    paymentMethod: 'COD',
    payment: false,
    status: 'Order Placed',
    date: Date.now()
  });

  await User.findByIdAndUpdate(userId, { $set: { cartData: {} } });
  return res.status(201).json(new ApiResponse(201, order, 'Order created successfully'));
});

// Online payment gateways are intentionally not implemented in this portfolio demo.
const placeOrderRazoprPay = asyncHandler(async (_req, res) => {
  return res.status(501).json({ success: false, message: 'Razorpay is not available in this demo' });
});

const placeOrderStripe = asyncHandler(async (_req, res) => {
  return res.status(501).json({ success: false, message: 'Stripe is not available in this demo' });
});

const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find({}).sort({ date: -1 });
  return res.status(200).json(new ApiResponse(200, orders, 'All orders fetched for admin'));
});

const getAllUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, 'Authentication required');

  const orders = await Order.find({ userId });
  return res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully'));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  await Order.findByIdAndUpdate(orderId, { status });
  return res.status(200).json(new ApiResponse(200, {}, 'Updated successfully'));
});

export {
  placeOrderCOD,
  placeOrderRazoprPay,
  placeOrderStripe,
  getAllOrders,
  getAllUserOrders,
  updateOrderStatus
};
