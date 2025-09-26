const router = require('express').Router();
const { authMiddleware } = require('../../middlewares/authMiddleware');
const { validateBody, validateParams } = require('../../middlewares/validationMiddleware');
const {
    CreatePaymentOrder,
    verifyPayment
}= require('../../controllers/paymentController');
const orderController = require('../../controllers/orderController')


router.use(authMiddleware);

router.post('/order',CreatePaymentOrder);
router.post('/verifypayment',verifyPayment);
router.get('/',orderController.getAllOrders);
router.get('/:id',orderController.getOrderById);
router.get('/user',orderController.getUserOrders);
router.patch('/status',orderController.updateOrderStatus);
router.patch('/:id',orderController.softDeleteOrder);
router.delete('/',orderController.hardDeleteOrder);

module.exports = router;