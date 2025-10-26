const router = require('express').Router();
const { authenticateToken } = require('../../middleware/auth');
const { idParamValidator } = require('../../middleware/validations/idValidation');
const {
    CreatePaymentOrder,
    verifyPayment
}= require('../../controllers/paymentController');
const orderController = require('../../controllers/orderController')


router.use(authenticateToken);

router.post('/',CreatePaymentOrder);
router.post('/verifypayment',verifyPayment);
//admin route
router.get('/',orderController.getAllOrders);
router.get('/user',orderController.getUserOrders);
router.patch('/status',orderController.updateOrderStatus);
router.get('/:id',idParamValidator,orderController.getOrderById);
router.patch('/:id',idParamValidator,orderController.softDeleteOrder);
router.delete('/:id',idParamValidator,orderController.hardDeleteOrder);

module.exports = router;