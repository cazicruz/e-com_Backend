const Product = require('../models/Products');
const { ApiError } = require('../utils/apiError');
const paginate = require('../utils/paginate');


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
    const product = await Product.findByIdAndUpdate(productId, updateObj, { new: true });
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    return product;
}

const deleteProduct = async (productId) => {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    return product;
}

const getProductById = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    return product;
}
const getAllProducts = async (filter = {}, options = {}) => {
    const products = await Product.find(filter, null, options);
    if (!products) {
        throw new ApiError('No products found', 404);
    }
    return products;
}
const getPaginatedProducts = async (filter = {}, options = {}) => {
    return await paginate(Product, filter, options);
}

const bulkDeleteProducts = async ( productIds = []) => {
    const result = await Product.deleteMany({ _id: { $in: productIds } });
    if (result.deletedCount === 0) {
        throw new ApiError('No products found', 404);
    }
    return result;
}

const changeProductStock = async (productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    product.stockQuantity = quantity;
    await product.save();
    return product;
}

const changeProductPopularity = async (productId, popularity) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    product.popularity = popularity;
    await product.save();
    return product;
}

const updateProductImages = async (productId, images) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    product.images = images;
    await product.save();
    return product;
}

const fillTheBlankImages = async (productId,images, index) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    for(let i=index; i<5; i++){
        if(images.length >0){
            product.images[i] = images.shift();
        }
    }
    await product.save();
    return product;
}

const updateImageAtIndex = async (productId, imageUrl, index) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    product.images[index] = imageUrl;
    await product.save();
    return product;
}

const updateImages = async (productId,images,index) => {
    if(index >5) throw new ApiError('Index out of bounds', 400);

    if(index && images !== undefined){
        console.log("entered here");
        if( Array.isArray(images) === false ){
            return await updateImageAtIndex(productId,images,index);
        }else if(Array.isArray(images) === true && images.length <= 5){
            fillTheBlankImages(productId,images,index);
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
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }
    product.popularity += incrementBy;
    await product.save();
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