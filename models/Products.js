const mongoose = require('mongoose');
const {algoliaQueue} = require('../jobs/algoliaQueue');

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
    popularity: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });


// after save (create or update)
productSchema.post("save", async function (doc) {
  await algoliaQueue.add("addOrUpdate", { product: doc.toObject() });
});

// after findOneAndUpdate
productSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await algoliaQueue.add("addOrUpdate", { product: doc.toObject() });
  }
});

// after delete
productSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await algoliaQueue.add("delete", { id: doc._id.toString() });
  }
});


module.exports = mongoose.model('Product', productSchema);