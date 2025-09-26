const Product = require('../models/Products');
const { ApiError } = require('../utils/apiError');
const paginate = require('../utils/paginate');
const {bulkDelete} = require('../utils/algoliaSearch')

const MAX_IMAGES=5

function assertValidId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError('Invalid productId', 400);
  }
}

function ensureImagesArray(arr) {
  const copy = Array.isArray(arr) ? arr.slice(0, MAX_IMAGES) : [];
  while (copy.length < MAX_IMAGES) copy.push(null);
  return copy;
}

/**
 * Creates a new product in the database.
 *
 * @async
 * @param {Object} prodObj - The product data.
 * @param {string} prodObj.name - The name of the product.
 * @param {string} prodObj.description - The description of the product.
 * @param {number} prodObj.price - The price of the product.
 * @param {string} [prodObj.category] - The category of the product.
 * @param {number} [prodObj.stock] - The stock quantity of the product.
 * @param {string[]} [prodObj.images] - Array of image URLs for the product.
 * @param {string} [prodObj.brand] - The brand of the product.
 * @param {Object} [prodObj.length] - The length details of the product.
 * @param {string} [prodObj.color] - The color of the product.
 * @param {number} [prodObj.popularity] - The popularity score of the product.
 * @returns {Promise<Object>} The created product document.
 * @throws {ApiError} If there is an error during product creation.
 */
const createProduct = async (prodObj) => {
    const product = await Product.create(prodObj);
    if (!product) {
        throw new ApiError('Product creation failed', 500);
    }
    return product;
}


const updateProduct = async (productId, updateObj) => {
    assertValidId(productId);
    const product = await Product.findByIdAndUpdate(productId, updateObj, { new: true });
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    return product;
}

const deleteProduct = async (productId) => {
    assertValidId(productId);
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    return product;
}

const getProductById = async (productId) => {
    assertValidId(productId);
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    return product;
}
const getAllProducts = async (filter = {}, options = {}) => {
    const products = await Product.find(filter, null, options);
    return products;
}
const getPaginatedProducts = async (filter = {}, options = {}) => {
    return await paginate(Product, filter, options);
}

const bulkDeleteProducts = async ( productIds = []) => {
    if (!Array.isArray(productIds) || productIds.length === 0) {
        throw new ApiError('productIds must be a non-empty array', 400);
    }
    const result = await Product.deleteMany({ _id: { $in: productIds } });
    if (result.deletedCount === 0) {
        throw new ApiError('No products found', 404);
    }
    await bulkDelete(productIds);

    return result;
}

const changeProductStock = async (productId, quantity) => {
    assertValidId(productId);
    const product = await Product.findByIdAndUpdate(
    productId,
    { $set: { stockQuantity: quantity } },
    { new: true, runValidators: true }
  );
  if (!product) throw new ApiError('Product not found', 404);
    return product;
}

const changeProductPopularity = async (productId, popularity) => {
    assertValidId(productId);
    const updated = await Product.findByIdAndUpdate(
        productId,
        { $set: { popularity } },
        { new: true, runValidators: true }
    );
    if (!updated) throw new ApiError('Product not found', 404);
    return updated;
}

// Replace the whole images array
const updateProductImages = async (productId, images) => {
    assertValidId(productId);
    if (!Array.isArray(images) || images.length > MAX_IMAGES) {
        throw new ApiError(`images must be an array with max ${MAX_IMAGES} items`, 400);
    }
    const updated = await Product.findByIdAndUpdate(
        productId,
        { $set: { images } },
        { new: true, runValidators: true }
    );
    if (!updated) throw new ApiError('Product not found', 404);
    return updated;
}

const fillTheBlankImages = async (productId,images, index) => {
    assertValidId(productId);
    if (!Number.isInteger(index) || index < 0 || index >= MAX_IMAGES) {
        throw new ApiError('Invalid index', 400);
    }
    if (!Array.isArray(images) || images.length === 0) {
        throw new ApiError('images must be a non-empty array', 400);
    }
    if (images.length > MAX_IMAGES) {
        throw new ApiError(`images array must be <= ${MAX_IMAGES}`, 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    const imgs=images.slice();
    for(let i=index; i<5; i++){
        if(imgs.length >0){
            product.images[i] = imgs.shift();
        }
    }
    await product.save();
    return product;
}

const updateImageAtIndex = async (productId, imageUrl, index) => {
    assertValidId(productId);
    if (!Number.isInteger(index) || index < 0 || index >= MAX_IMAGES) {
        throw new ApiError('Invalid index', 400);
    }
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    product.images[index] = imageUrl;
    await product.save();
    return product;
}

const updateImages = async (productId,images,index) => {
    assertValidId(productId);
    if(index >4) throw new ApiError('Index out of bounds', 400);

    if((index !== undefined && index !== null) && images !== undefined){
        console.log("entered here");
        if( Array.isArray(images) === false ){
            return await updateImageAtIndex(productId,images,index);
        }else if(Array.isArray(images) === true && images.length <= 5){
            return await fillTheBlankImages(productId,images,index);
        }else{
        throw new ApiError('Invalid  index for image', 400);
        }
    }
    else if(images !== undefined && Array.isArray(images) === true && images.length <= 5){
        return await updateProductImages(productId,images);
    }
    else{
        throw new ApiError('Invalid images or index', 400);
    }
}

const incrementProductPopularity = async (productId, incrementBy = 1) => {
    assertValidId(productId);
    const product = await Product.findByIdAndUpdate(
        productId,
        { $inc: { popularity: incrementBy } },
        { new: true }
    );
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    return product;
}

module.exports= {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getPaginatedProducts,
    getAllProducts,
    bulkDeleteProducts,
    changeProductStock,
    changeProductPopularity,
    updateProductImages,
    updateImageAtIndex,
    updateImages,
    incrementProductPopularity
}