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
    if (doc.isDeleted) {
      await algoliaQueue.add("delete", { id: doc._id.toString() });
    } else {
      await algoliaQueue.add("addOrUpdate", { product: doc.toObject() });
    }
//   await algoliaQueue.add("addOrUpdate", { product: doc.toObject() });
});

// after findOneAndUpdate
productSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    if (doc.isDeleted) {
      await algoliaQueue.add("delete", { id: doc._id.toString() });
    } else {
      await algoliaQueue.add("addOrUpdate", { product: doc.toObject() });
    }
  }
});

// after delete
productSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await algoliaQueue.add("delete", { id: doc._id.toString() });
  }
});

productSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
  this._docToDelete = await this.model.findOne(this.getFilter(), "_id").lean();
  next();
});

productSchema.post("deleteOne", async function () {
  if (this._docToDelete) {
    await algoliaQueue.add("delete", { id: this._docToDelete._id.toString() });
  }
});


// Bulk delete middleware
productSchema.pre("deleteMany", async function (next) {
  // "this" refers to the query
  this._docsToDelete = await this.model.find(this.getFilter(), "_id").lean();
  next();
});

productSchema.post("deleteMany", async function () {
  if (this._docsToDelete?.length) {
    const ids = this._docsToDelete.map(d => d._id.toString());
    await algoliaQueue.add("deleteMany",{ids});
    console.log(`🗑️ Deleted ${ids.length} products from Algolia`);
  }
});

module.exports = mongoose.model('Product', productSchema);