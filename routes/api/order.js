const router = require('express').Router;
const { authMiddleware } = require('../../middlewares/authMiddleware');
const { validateBody, validateParams } = require('../../middlewares/validationMiddleware');
const {
    CreatePaymentOrder,
    verifyPayment
}= require('../../controllers/paymentController');


router.use(authMiddleware);

router.post('/order',CreatePaymentOrder);
router.post('/verifypayment',verifyPayment);