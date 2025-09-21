const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    paymentId:String,
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'canceled'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    shippingAddress: String,
    billingAddress: String,
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }]
});

module.exports = mongoose.model('Order', orderSchema);