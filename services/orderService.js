const { Order } = require('../models/Order');
const Cart = require('../models/Cart');
const { calculateCartTotals } = require('../services/cartService');
const { ApiError } = require('../utils/apiError');
const mongoose = require('mongoose');

async function createOrderFromCart(userId, orderDetails, initiatePaymentFn) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch the user's cart (inside the transaction)
    const userCart = await Cart.findOne({ userId })
      .populate('items.productId')
      .session(session);

    if (!userCart || userCart.items.length === 0) {
      throw new ApiError(400, 'Cart is empty');
    }

    // 2. Calculate cart totals (pass options if needed, e.g. deliveryType)
    const totals = await calculateCartTotals(userId, orderDetails);
    if (!totals) {
      throw new ApiError(400, 'Failed to calculate cart totals');
    }

    // 3. Create the order (attach subtotal, tax, deliveryFee, total explicitly)
    const orderItems = userCart.items.map(i => ({
      productId: i.productId._id,
      name: i.productId.name,
      price: i.productId.price,
      quantity: i.quantity,
    }));

    const order = new Order({
      userId,
      items: orderItems,
      subtotal: totals.subtotal,
      tax: totals.tax,
      totalAmount: totals.total,
      contactInfo: orderDetails.contactInfo,
      deliveryInfo: orderDetails.deliveryInfo,
      billingAddress: orderDetails.billingAddress,
      status: 'pending',
    });

    await order.save({ session });

    // 4. Clear the user's cart
    userCart.items = [];
    await userCart.save({ session });

    // 5. Initiate payment if function provided
    let paymentLink;
    if (initiatePaymentFn) {
      paymentLink = await initiatePaymentFn(
        order.totalAmount * 100, // convert to kobo
        order.contactInfo.email,
        userId,
        order._id
      );
    }

    order.paymentLink = paymentLink;
    await order.save({ session });

    // 5. Commit transaction
    await session.commitTransaction();
    return { order, paymentLink };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async function updateOrderStatus(orderId, newStatus,amount) {
    const validStatuses = ['pending', 'shipped', 'delivered', 'canceled'];

    if (!validStatuses.includes(newStatus)) {
        throw new ApiError(400, 'Invalid order status');
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }
    if (amount && amount< order.totalAmount) {
        throw new ApiError(400, 'Amount mis-match');
    }
    if(order.status === newStatus){
        return
    }

    order.status = newStatus;
    await order.save();
}

async function getOrderById(orderId) {
    const order = await Order.findById(orderId).populate('items.productId');
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }
    return order;
}

async function getUserOrders(userId) {
    const orders = await Order.find({ userId, isDeleted: false })
    if (!orders || orders.length === 0) {
        throw new ApiError(404, 'No orders found for this user');
    }
    return orders;
}

async function getAllOrders() {
    const orders = await Order.find().populate('items.productId');
    return orders;
}

async function deleteOrder(orderId) {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }
    return order;
}

async function softDeleteOrder(orderId) {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }   
    order.isDeleted = true;
    await order.save();
    return order;
}

module.exports = {
  createOrderFromCart,
  getOrderById,
  getUserOrders,
  softDeleteOrder,
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
};
