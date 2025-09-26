const orderServices = require('../services/orderService')
const apiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');


const updateOrderStatus = catchAsync(async(req, res)=>{
    await orderServices.updateOrderStatus(req.body.orderId, req.body.status)
    res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: {
        }
    })
})

const getOrderById= catchAsync(async(req,res)=>{
    const id= req.params.id;
    const order = await orderServices.getOrderById(id)

    res.status(200).json({
        success: true,
        message: 'Order retieved Successfully',
        data: order
    })
})

const getUserOrders = catchAsync(async(req,res)=>{
    const orders = await orderServices.getUserOrders(req.user.id);
    res.status(200).json({
        success: true,
        message: 'User\'s Orders retieved Successfully',
        data: orders
    })
})

const getAllOrders= catchAsync(async(req,res)=>{
    const orders = await orderServices.getAllOrders()
    res.status(200).json({
        success: true,
        message: ' All Orders retieved Successfully',
        data: orders
    })
})

const softDeleteOrder = catchAsync(async(req,res)=>{
    const order= await orderServices.softDeleteOrder(req.params.id)
    res.status(200).json({
        success: true,
        message: 'Order deleted Successfully',
        data: order
    })
})

const hardDeleteOrder = catchAsync(async(req,res)=>{
    const deletedOrder = await orderServices.deleteOrder(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Order deleted Successfully',
        data: deletedOrder
    })
})

module.exports={
    updateOrderStatus,
    getOrderById,
    getUserOrders,
    softDeleteOrder,
    getAllOrders,
    hardDeleteOrder
}