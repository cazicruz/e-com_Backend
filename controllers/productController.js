const {createProduct, updateProduct, deleteProduct, getProductById, getPaginatedProducts, getAllProducts, bulkDeleteProducts, changeProductStock, changeProductPopularity, updateProductImages, updateImageAtIndex} = require('../services/productService');
const { ApiError } = require('../utils/apiError');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const catchAsync = require('../utils/catchAsync');


const cloudinaryUploads = async (files) => {
    return await Promise.all(
        files.map(file => cloudinary.uploader.upload(file.path, { folder: 'products' }))
    );
}


const createProductController = catchAsync(async (req, res) => {
    const cloudinaryUploads =  await cloudinaryUploads(req.files);

    const prodObj = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        categories: req.body.categories ? JSON.parse(req.body.categories) : [],
        stock: req.body.stock || 0,
        images: cloudinaryUploads ? cloudinaryUploads.map(upload => upload.secure_url) : [],
        brand: req.body.brand || '',
        length: req.body.length ? JSON.parse(req.body.length) : {},
        color: req.body.color || '',
        popularity: req.body.popularity || 0
    }
    const product = await createProduct(prodObj);
    res.status(201).json({
        status: 'success',
        data: {
            product
        }
    }); 
})


const updateProductController = catchAsync(async (req, res) => {
    const productId = req.params.id;
    let updateObj = req.body;
    let cloudinaryUploads = [];

    if (req.files && req.files.length > 0) {
        if(req.files.length > 5 && (!updateObj.images || (updateObj.images && (JSON.parse(updateObj.images).length + req.files.length) > 5))){
            throw new ApiError('You can have maximum 5 images', 400);
        }
        if (!updateObj.images) updateObj.images = [];
        else updateObj.images = JSON.parse(updateObj.images);
        
        cloudinaryUploads = await cloudinaryUploads(req.files);
        updateObj.images.push(...cloudinaryUploads.map(upload => upload.secure_url));
    }

    const product = await updateProduct(productId, updateObj);
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
})

const deleteProductController = catchAsync(async (req, res) => {
    const productId = req.params.id;
    await deleteProduct(productId);
    res.status(204).json({
        status: 'success',
        data: null
    });
})

const getProductByIdController = catchAsync(async (req, res) => {
    const productId = req.params.id;
    const product = await getProductById(productId);
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
})

const getAllProductsController = catchAsync(async (req, res) => {
    const filter = {};
    const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: req.query.sort || 'createdAt',
        populate: req.query.populate || ''
    };
    const products = await getPaginatedProducts(filter, options);
    res.status(200).json({
        status: 'success',
        data: {
            products
        }
    });
})
const bulkDeleteProductsController = catchAsync(async (req, res) => {
    const { productIds } = req.body;
    await bulkDeleteProducts(productIds);
    res.status(204).json({
        status: 'success',
        data: null
    });
})
const changeProductStockController = catchAsync(async (req, res) => {
    const productId = req.params.id;
    const { quantity } = req.body;
    const product = await changeProductStock(productId, quantity);
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
})
const changeProductPopularityController = catchAsync(async (req, res) => {
    const productId = req.params.id;
    const { popularity } = req.body;
    const product = await changeProductPopularity(productId, popularity);
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
})

const updateProductImagesController = catchAsync(async (req, res) => {
    const productId = req.params.id;
    const index = req.body.index;
    const cloudinaryUploads = await Promise.all(
        req.files.map(file => cloudinary.uploader.upload(file.path, { folder: 'products' }))
    );
    const product = await updateImages(productId, cloudinaryUploads, index);
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
})
module.exports = {
    createProductController,
    updateProductController,
    deleteProductController,
    getProductByIdController,
    getAllProductsController,
    bulkDeleteProductsController,
    changeProductStockController,
    changeProductPopularityController,
    updateProductImagesController
}