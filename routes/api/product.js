const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const {validateProduct,
    validateStock,
    validatePopularity,
    validateImages,
} = require("../../middleware/validations/productValidation");
const {
  idParamValidator,
  bulkIdsValidator,
} = require("../../middleware/validations/idValidation");
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

    router.post('/', upload.array('fImages'),validateProduct, createProductController);
    router.get('/', getAllProductsController);
    router.delete('/bulk', bulkDeleteProductsController);
    router.put('/:id', upload.array('fImages'),validateProduct, updateProductController);
    router.delete('/:id',idParamValidator, deleteProductController);
    router.get('/:id',idParamValidator, getProductByIdController);
    router.patch('/:id/stock',validateStock, changeProductStockController);
    router.patch('/:id/popularity',validatePopularity, changeProductPopularityController);
    router.patch('/:id/images',idParamValidator, upload.array('images'),validateImages, updateProductImagesController);

module.exports = router;



/**
 * @route POST /api/product
 * @summary Create a new product
 * @tags Product
 * @consumes multipart/form-data
 * @param {string} name.formData.required - Product name (e.g. "T-shirt")
 * @param {string} description.formData - Product description (e.g. "A cool cotton t-shirt")
 * @param {number} price.formData.required - Product price (e.g. 19.99)
 * @param {string} categories.formData - JSON array string, e.g. '["clothing","summer"]'
 * @param {integer} stock.formData - Stock quantity (e.g. 10)
 * @param {string} brand.formData - Brand (e.g. "Nike")
 * @param {string} length.formData - JSON object string, e.g. '{"value": 10, "unit": "inches"}'
 * @param {string} color.formData - Color (e.g. "red")
 * @param {integer} popularity.formData - Popularity (e.g. 0)
 * @param {file[]} images.formData - Up to 5 image files
 * @response 201 - Product created (ProductResponse)
 * @response 400 - Invalid input or too many images
 * @response 500 - Server error
 */

/**
 * @route GET /api/product
 * @summary Get paginated list of products
 * @tags Product
 * @param {integer} page.query - Page number (default: 1)
 * @param {integer} limit.query - Page size (default: 10)
 * @param {string} sort.query - Sort field (default: createdAt)
 * @param {string} populate.query - Fields to populate
 * @response 200 - List of products
 * @response 500 - Server error
 */

/**
 * @route GET /api/product/{id}
 * @summary Get product by ID
 * @tags Product
 * @param {string} id.path.required - Product ID
 * @response 200 - Product found (ProductResponse)
 * @response 404 - Product not found
 */

/**
 * @route PUT /api/product/{id}
 * @summary Update a product
 * @tags Product
 * @consumes multipart/form-data
 * @param {string} id.path.required - Product ID
 * @param {string} name.formData - Product name
 * @param {string} description.formData - Product description
 * @param {number} price.formData - Product price
 * @param {string} categories.formData - JSON array string
 * @param {integer} stock.formData - Stock quantity
 * @param {string} brand.formData - Brand
 * @param {string} length.formData - JSON object string
 * @param {string} color.formData - Color
 * @param {integer} popularity.formData - Popularity
 * @param {file[]} images.formData - Up to 5 image files
 * @response 200 - Product updated (ProductResponse)
 * @response 400 - Invalid input or too many images
 * @response 404 - Product not found
 */

/**
 * @route DELETE /api/product/{id}
 * @summary Delete a product
 * @tags Product
 * @param {string} id.path.required - Product ID
 * @response 204 - Product deleted
 * @response 404 - Product not found
 */

/**
 * @route POST /api/product/bulk-delete
 * @summary Bulk delete products
 * @tags Product
 * @param {string[]} productIds.body.required - Array of product IDs
 * @response 204 - Products deleted
 * @response 404 - No products found
 */

/**
 * @route PATCH /api/product/{id}/stock
 * @summary Change product stock
 * @tags Product
 * @param {string} id.path.required - Product ID
 * @param {integer} quantity.body.required - New stock quantity
 * @response 200 - Stock updated (ProductResponse)
 * @response 404 - Product not found
 */

/**
 * @route PATCH /api/product/{id}/popularity
 * @summary Change product popularity
 * @tags Product
 * @param {string} id.path.required - Product ID
 * @param {integer} popularity.body.required - New popularity value
 * @response 200 - Popularity updated (ProductResponse)
 * @response 404 - Product not found
 */

/**
 * @route PATCH /api/product/{id}/images
 * @summary Update product images
 * @tags Product
 * @consumes multipart/form-data
 * @param {string} id.path.required - Product ID
 * @param {integer} index.formData - Index to update (optional)
 * @param {file[]} images.formData - Up to 5 image files
 * @response 200 - Images updated (ProductResponse)
 * @response 400 - Invalid images or index
 * @response 404 - Product not found
 */




