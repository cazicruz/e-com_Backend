const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const {
    createProductController,
    updateProductController,
    deleteProductController,
    getProductByIdController,
    getAllProductsController,
    bulkDeleteProductsController,
    changeProductStockController,
    changeProductPopularityController,
    updateProductImagesController} = require('../../controllers/productController');

    router.post('/', upload.array('images'), createProductController);
    router.put('/:id', upload.array('images'), updateProductController);
    router.delete('/:id', deleteProductController);
    router.get('/:id', getProductByIdController);
    router.get('/', getAllProductsController);
    router.delete('/bulk', bulkDeleteProductsController);
    router.patch('/:id/stock', changeProductStockController);
    router.patch('/:id/popularity', changeProductPopularityController);
    router.patch('/:id/images', upload.array('images'), updateProductImagesController);

module.exports = router;