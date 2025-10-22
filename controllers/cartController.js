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
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    const result = await addItemToCart(userId, productId, quantity);
    res.status(200).json({
        status: 'success',
        message: 'Item added to cart successfully',
        data: {
            cart: result
        }
    });
});


const addItemBulk = catchAsync(async (req, res, next) => {
    const { items } = req.body;
    const userId = req.user._id;
    const result = await addToCartBulk(userId, items);
    res.status(200).json({
        status: 'success',
        message: 'cart synced successfully',
        data: {
            cart: result
        }
    });
});

const removeItem = catchAsync(async (req, res, next) => {
    const { productId } = req.body;
    const userId = req.user._id;
    const result = await removeItemFromCart(userId, productId);
    res.status(200).json({
        status: 'success',
        message: 'Item removed from cart successfully',
        data: {
            cart: result
        }
    });
});

const clearUserCart = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const result = await clearCart(userId);
    res.status(200).json({
        status: 'success',
        message: 'Cart cleared successfully',
        data: {
            cart: result
        }
    });
});

const getUserCart = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const result = await getCart(userId);
    res.status(200).json({
        status: 'success',
        message: 'Cart retrieved successfully',
        data: {
            cart: result
        }
    });
});

const updateQuantity = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    const result = await updateItemQuantity(userId, productId, quantity);
    res.status(200).json({
        status: 'success',
        message: 'Item quantity updated successfully',
        data: {
            cart: result
        }
    });
});

const calculateCartTotal = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const totals = await calculateCartTotals(userId);
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
