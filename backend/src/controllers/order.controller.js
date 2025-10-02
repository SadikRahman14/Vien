import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const placeOrderCOD = asyncHandler(async (req, res) => {

    const userId = req.user?._id || req.body?.userId;
    const { items, address, amount } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'userId (or authenticated user) is required' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'items must be a non-empty array' });
    }
    if (!address) {
        return res.status(400).json({ success: false, message: 'address is required' });
    }
    if (typeof amount !== 'number' && typeof amount !== 'string') {
        return res.status(400).json({ success: false, message: 'amount is required' });
    }

    const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod: 'COD',
        payment: false,
        status: 'pending',
        date: Date.now()
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    await User.findByIdAndUpdate(userId, { $set: { cartData: {} } });

    return res.status(201)
        .json(
            new ApiResponse(201, "Order Created Successfully", newOrder)
        )
});

const placeOrderRazoprPay = asyncHandler(async (req, res) => {

})

const placeOrderStripe = asyncHandler(async (req, res) => {

})

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({ date: -1 });

    return res.status(200).json(
        new ApiResponse(200, orders, "All orders fetched for admin")
    );
});


const getAllUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.body?.userId;

    if (!userId) {
        throw new ApiError(404, "User ID Not Found");
    }

    const orders = await Order.find({ userId }); 

    return res.status(200).json(
        new ApiResponse(200, orders, "Orders Fetched Successfully")
    );
});



const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId, status } = req.body;

    await Order.findByIdAndUpdate(orderId, { status })
    
    return res.status(200)
        .json(
            new ApiResponse(200, {}, "Updated Successfully")
    )
})

export {
    placeOrderCOD,
    placeOrderRazoprPay,
    placeOrderStripe,
    getAllOrders,
    getAllUserOrders,
    updateOrderStatus
}