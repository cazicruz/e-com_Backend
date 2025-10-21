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
    enum: ['pending', 'shipping', 'delivered', 'canceled'],
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
  paymentDetails:{
    paymentLink: String,
    reference:String,
    accessCode:String,
    status:{type:String,
      default:'awaiting payment'
    }
  },
  isDeleted: { type: Boolean, default: false }
},{ timestamps: true });

orderSchema.index({ 'paymentDetails.reference': 1 });
 
const Order = mongoose.model('Order', orderSchema);

module.exports = { Order, deliveryMethod };
