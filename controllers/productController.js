const {createProduct, updateProduct, deleteProduct, getProductById, getPaginatedProducts, getAllProducts, bulkDeleteProducts, changeProductStock, changeProductPopularity, updateProductImages, updateImages} = require('../services/productService');
const { ApiError } = require('../utils/apiError');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const catchAsync = require('../utils/catchAsync');
const streamifier = require('streamifier');

const CloudinaryUploads = async (files) => {
  return await Promise.all(
    files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        // Pipe the buffer into Cloudinary
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    })
  );
};




const createProductController = catchAsync(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw new ApiError('At least one image is required', 400);
    }
    const cloudinaryUploads =  await CloudinaryUploads(req.files);
        console.log(cloudinaryUploads);
    if (!cloudinaryUploads || cloudinaryUploads.length === 0) {
        throw new ApiError('Image upload failed', 400);
    }
    try{
        const prodObj = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            categories: req.body.categories ? req.body.categories : [],
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
    }catch(err){
        await Promise.allSettled(
        (cloudinaryUploads || []).map(upload =>
            cloudinary.uploader.destroy(upload.public_id)
        )
        );
        console.log(err);
        res.status(400).json({
            status: 'error',
            message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
        });
    }
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
        
        cloudinaryUploads = await CloudinaryUploads(req.files);
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
    const {filter} = req.query || {};
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
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
    const cloudinaryUploads = await CloudinaryUploads(req.files);
    try{
        const images = cloudinaryUploads.map(upload => upload.secure_url);
        const product = await updateImages(productId, images, index);
        if(!product){
            throw new ApiError('Error Updating Product Image', 404);
        }
        res.status(200).json({
            status: 'success',
            data: {
                product
            }
        });
    }catch(err){
        await Promise.allSettled(
        (cloudinaryUploads || []).map(upload =>
            cloudinary.uploader.destroy(upload.public_id)
        )
        );
        console.log(err);
        res.status(400).json({
            status: 'error',
            message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
        });
    }
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