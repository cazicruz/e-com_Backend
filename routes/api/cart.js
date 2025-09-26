const Router = require('express').Router();
const { 
    addItem,
    removeItem,
    clearUserCart,
    getUserCart,
    updateQuantity,
    calculateCartTotal
} = require('../../controllers/cartController');
const { ApiError } = require('../../utils/apiError');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const { validateBody, validateParams } = require('../../middlewares/validationMiddleware');
const { 
    addItemSchema,
    removeItemSchema,
    updateQuantitySchema
} = require('../../middleware/validations/cartValidation');

Router.use(authMiddleware);

Router.post('/add', validateBody(addItemSchema), addItem);
Router.delete('/remove', validateBody(removeItemSchema), removeItem);
Router.delete('/clear', clearUserCart);
Router.get('/', getUserCart);
Router.patch('/update-quantity', validateBody(updateQuantitySchema), updateQuantity);
Router.get('/calculate-total', calculateCartTotal);

module.exports = Router;
