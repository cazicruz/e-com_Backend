const Router = require('express').Router();
const { 
    addItem,
    addItemBulk,
    removeItem,
    clearUserCart,
    getUserCart,
    updateQuantity,
    calculateCartTotal
} = require('../../controllers/cartController');
const { ApiError } = require('../../utils/apiError');
const { authenticateToken } = require('../../middleware/auth');
// const { validateBody, validateParams } = require('../../middlewares/validationMiddleware');
const { 
    addItemSchema,
    removeItemSchema,
    updateQuantitySchema
} = require('../../middleware/validations/cartValidation');

// Router.use(authenticateToken);

Router.post('/add', addItemSchema, addItem);
Router.post('/add-bulk', addItemBulk);
Router.delete('/remove', removeItemSchema, removeItem);
Router.delete('/clear', clearUserCart);
Router.get('/:id', getUserCart);
Router.patch('/update-quantity', updateQuantitySchema, updateQuantity);
Router.get('/calculate-total', calculateCartTotal);

module.exports = Router;
