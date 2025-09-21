const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength:100,
        minlength:3,
    },
    description: String,
    price: {
        type: Number,
        required: true,
        min: 0
    },
    categories: [String],
    tags: [String],
    images: {
        type:[String],
        maxlength:5
    },
    stockQuantity: {
        type: Number,
        default: 0
    },
    brand: String,
    length: {
        value: Number,
        unit: {
            type: String,
            enum: ['inches', 'meters', 'feet']
        }
    },
    color: String,
    popularity: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);