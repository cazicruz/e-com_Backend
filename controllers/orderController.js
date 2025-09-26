const orderServices = require('../services/orderService')
const apiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');


const updateOrderStatus = catchAsync(async(req, res)=>{
    await orderServices.updateOrderStatus(req.body.orderId, req.body.status)
    res.status(200).json({
        success: true,
        message: 'User registered successfully',
        data: {
        }
    })
})