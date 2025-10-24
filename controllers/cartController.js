const {
    addItemToCart,
    addToCartBulk,
    removeItemFromCart,
    clearCart,
    getCart,
    updateItemQuantity
} = require('../services/cartService');
const catchAsync = require('../utils/catchAsync');
const {ApiError} = require('../utils/apiError');
const {calculateCartTotals} = require('../services/cartService')

const addItem = catchAsync(async (req, res, next) => {
    const {cartId, productId, quantity } = req.body;
    const result = await addItemToCart(cartId, productId, quantity);
    res.status(200).json({
        status: 'success',
        message: 'Item added to cart successfully',
        data: {
            cart: result
        }
    });
});

const addItemBulk = catchAsync(async (req, res, next) => {
    const { cartId, items } = req.body; // ✅ Add cartId
    const result = await addToCartBulk(cartId, items);
    res.status(200).json({
        status: 'success',
        message: 'cart synced successfully',
        data: {
            cart: result
        }
    });
});

const removeItem = catchAsync(async (req, res, next) => {
    const { cartId, productId } = req.body; // ✅ Get both from body
    const result = await removeItemFromCart(cartId, productId);
    res.status(200).json({
        status: 'success',
        message: 'Item removed from cart successfully',
        data: {
            cart: result
        }
    });
});

const clearUserCart = catchAsync(async (req, res, next) => {
    const { cartId } = req.body;
    const result = await clearCart(cartId);
    res.status(200).json({
        status: 'success',
        message: 'Cart cleared successfully',
        data: {
            cart: result
        }
    });
});

const getUserCart = catchAsync(async (req, res, next) => {
    const cartId = req.query.id || req.params.id; // ✅ Get from query params
    const result = await getCart(cartId);
    res.status(200).json({
        status: 'success',
        message: 'Cart retrieved successfully',
        data: {
            cart: result
        }
    });
});

const updateQuantity = catchAsync(async (req, res, next) => {
    const { cartId, productId, quantity } = req.body;
    const result = await updateItemQuantity(cartId, productId, quantity);
    res.status(200).json({
        status: 'success',
        message: 'Item quantity updated successfully',
        data: {
            cart: result
        }
    });
});

const calculateCartTotal = catchAsync(async (req, res, next) => {
    const cartId = req.query.cartId; // ✅ Get from query params
    const totals = await calculateCartTotals(cartId);
    res.status(200).json({
        status: 'success',
        message: 'Cart totals calculated successfully',
        data: {
            totals
        }
    });
});

module.exports = {
    addItem,
    addItemBulk,
    removeItem,
    clearUserCart,
    getUserCart,
    updateQuantity,
    calculateCartTotal
};