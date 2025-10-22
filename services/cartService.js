const Cart = require('../models/Cart');
const Product = require('../models/Products');
const { ApiError } = require('../utils/apiError');
const { deliveryMethod } = require('../models/Order'); 



// Add item to cart
async function addItemToCart(userId, productId, quantity) {
    let validProduct= await Product.findById(productId)
    console.log(validProduct);
    if(!validProduct)throw new ApiError('ivalid Product',404)
    if(validProduct.stockQuantity < 1)throw new ApiError('Product out of Stock',422);
        
    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
        userCart = new Cart({ userId, items: [] });
    }
    const existingItem = userCart.items.find(item => item.productId.equals(productId));
    if (existingItem) {
      const newQuantity = Number(existingItem.quantity) + Number(quantity);
      if (newQuantity > validProduct.stockQuantity) {
        throw new ApiError('Insufficient stock', 422);
      }
      existingItem.quantity = newQuantity;
    } else {
        userCart.items.push({ productId, quantity });
    }
    await userCart.save();
    return userCart;
}

async function addToCartBulk(userId, items) {
    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
        userCart = new Cart({ userId, items: [] });
    }

    for (const item of items) {
        const { productId, quantity } = item;
        const validProduct = await Product.findById(productId);
        if (!validProduct) throw new ApiError('Invalid Product', 404);
        if (validProduct.stockQuantity < 1) throw new ApiError('Product out of Stock', 422);

        const existingItem = userCart.items.find(item => item.productId.equals(productId));
        if (existingItem) {
            const newQuantity = Number(existingItem.quantity) + Number(quantity);
            if (newQuantity > validProduct.stockQuantity) {
                throw new ApiError('Insufficient stock', 422);
            }
            existingItem.quantity = newQuantity;
        } else {
            userCart.items.push({ productId, quantity });
        }
    }

    await userCart.save();
    return userCart;
}

async function removeItemFromCart(userId, productId) {
    const userCart = await Cart.findOne({ userId });
    if (!userCart) throw new ApiError('Cart not found', 404);
    userCart.items = userCart.items.filter(item => !item.productId.equals(productId));
    await userCart.save();
    return userCart;
}

/**
 * Clears the user's cart.
 * Works standalone or inside a transaction if `session` is passed.
 *
 * @param {String} userId - The ID of the user
 * @param {Object} [session] - Optional Mongoose session for transactions
 * @returns {Promise<Object>} The updated cart document
 */
async function clearCart(userId, session = null) {
  const queryOptions = session ? { session } : {};

  const userCart = await Cart.findOne({ userId }, queryOptions);
  if (!userCart) {
    throw new ApiError('Cart not found', 404);
  }
  userCart.items = [];
  await userCart.save(queryOptions);
  return userCart;
}

async function getCart(userId) {
    const userCart = await Cart.findOne({ userId }).populate('items.productId');
    if (!userCart) throw new ApiError('Cart not found', 404);
    return userCart;
}

async function updateItemQuantity(userId, productId, quantity) {
    const userCart = await Cart.findOne({ userId });
    if (!userCart) throw new ApiError('Cart not found', 404);
    const item = userCart.items.find(item => item.productId.equals(productId));
    if (!item) throw new ApiError('Item not found in cart', 404);
    item.quantity = quantity;
    await userCart.save();
    return userCart;
}


/**
 * Calculate totals from a user's cart
 * @param {ObjectId} userId
 * @param {Object} options
 * @param {String} options.deliveryType - 'home_delivery' or 'store_pickup'
 * @param {String} options.deliveryMethod - 'standard' or 'express'
 * @param {Number} options.taxRate - e.g. 0.075 for 7.5%
 * @returns {Object} { subtotal, tax, deliveryFee, total }
 */
async function calculateCartTotals(userId, options = {}) {
  const { deliveryType = 'home_delivery', delivery_Method = 'standard', taxRate = 0.075 } = options;

  // Fetch user cart with populated product prices
  const cart = await Cart.findOne({ userId }).populate('items.productId', 'price');
  if (!cart) throw new ApiError('Cart not found', 404);

  // Subtotal = Σ (price × quantity)
  let subtotal = 0;
  for (const item of cart.items) {
    if (!item.productId) {
      throw new ApiError(`Product not found for item: ${item._id}`, 404);
    }
    subtotal += item.productId.price * item.quantity;
  }

  // Tax
  const tax = Math.round(subtotal * taxRate); // ✅ Round to avoid decimals

  // Delivery Fee
  let deliveryFee = 0;
  if (deliveryType === 'home_delivery') {
    deliveryFee = deliveryMethod[delivery_Method.toUpperCase()]?.cost || 0;  
  }

  // Final Total
  const total = subtotal + tax + deliveryFee;

  return {
    subtotal,
    tax,
    deliveryFee,
    total,
  };
}


module.exports = {
    addItemToCart,
    addToCartBulk,
    removeItemFromCart,
    clearCart,
    getCart,
    updateItemQuantity,
    calculateCartTotals
};
