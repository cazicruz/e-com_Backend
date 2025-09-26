const mongoose = require('mongoose');
const Product = require('./Products');

const deliveryMethod = {
  STANDARD: { method: 'standard', cost: 10000 },
  EXPRESS: { method: 'express', cost: 20000 }
};

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  paymentId: String,
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'canceled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  contactInfo: {
    fullName: { type: String },
    email: { type: String, required: true },
    phone: String
  },
  deliveryInfo: {
    deliveryType: {
      type: String,
      enum: ['home_delivery', 'store_pickup'],
      default: 'home_delivery'
    },
    deliveryMethod: {
      type: String,
      enum: [deliveryMethod.STANDARD.method, deliveryMethod.EXPRESS.method],
      default: deliveryMethod.STANDARD.method
    },
    address: String
  },
  billingAddress: String,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1, default: 1 }
  }],
    paymentLink: String,
  isDeleted: { type: Boolean, default: false }
},{ timestamps: true });

// orderSchema.pre('save', async function(next) {
//   try {
//     const order = this;

//     // 1. Calculate subtotal from items
//     let subtotal = 0;
//     for (const item of order.items) {
//       const product = await Product.findById(item.productId).select('price');
//       if (!product) throw new Error(`Product not found: ${item.productId}`);
//       subtotal += product.price * item.quantity;
//     }

//     // 2. Determine delivery cost (only for home_delivery)
//     let deliveryCost = 0;
//     if (order.deliveryInfo.deliveryType === 'home_delivery') {
//       const delivery = Object.values(deliveryMethod)
//         .find(m => m.method === order.deliveryInfo.deliveryMethod);
//       if (delivery) deliveryCost = delivery.cost;
//     }

//     // 3. Set totalAmount freshly
//     order.totalAmount = subtotal + deliveryCost;

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order, deliveryMethod };
