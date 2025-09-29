const router = require('express').Router();
const { authenticateToken } = require('../../middleware/auth');
const { idParamValidator } = require('../../middleware/validations/idValidation');
const {
    CreatePaymentOrder,
    verifyPayment
}= require('../../controllers/paymentController');
const orderController = require('../../controllers/orderController')


router.use(authenticateToken);

router.post('/order',CreatePaymentOrder);
router.post('/verifypayment',verifyPayment);
router.get('/',orderController.getAllOrders);
router.get('/:id',idParamValidator,orderController.getOrderById);
router.get('/user',orderController.getUserOrders);
router.patch('/status',orderController.updateOrderStatus);
router.patch('/:id',idParamValidator,orderController.softDeleteOrder);
router.delete('/:id',orderController.hardDeleteOrder);

module.exports = router;