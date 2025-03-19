const CatchAsyncErr = require('../middlewares/CatchAsyncErr')
const Order = require('../models/orderModel')
const ErrorHandler = require("../utils/errorHandler");
const Product = require('../models/ProductModels')


//create new oder - api/v3/order/new
exports.newOrder = CatchAsyncErr(async (req, res, next) => {
    console.log('req',req.body)
    const { orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo } = req.body

        const order = await Order.create({
            orderItems,
            shippingInfo,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paidAt: Date.now(),
            user: req.user.id
        })

        res.status(200).json({
            success:true,
            order
        })

})

//get Single order - api/v3/order/:id
exports.getSingleOrder = CatchAsyncErr(async (req,res,next)=>{

    const order = await Order.findById(req.params.id).populate('user','name email')
    if (!order){
        return next(new ErrorHandler(`Order not found with this id:${req.params.id}`,404))
    }

    res.status(200).json({
        success:true,
        order
    })
})

//get Loggedin IUse Order - api/v3/myorders
exports.myorder = CatchAsyncErr(async (req,res,next)=>{
    const orders = await Order.find({user:req.user.id});
    console.log('orders',orders)
    res.status(200).json({
        success:true,
        orders
    })
})

//Admin: Get all order - api/v3/orders
exports.orders = CatchAsyncErr(async (req,res,next)=>{
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    });
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

//update order /order status  /api/v3/orders/:id
exports.updateOrder = CatchAsyncErr(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(order.orderStatus == 'Deliverd'){
        return next(new ErrorHandler('Order has been already Delivered',400))
    }

    //updating the product stock in each order
    order.orderItems.forEach(async orderItem =>{
        await updateStock(orderItem.product,orderItem.quantity)
    })

    order.orderStatus = req.body.orderStatus
    order.deliveredAt = Date.now()
    await order.save()

    res.status(200).json({
        success:true,
    })
})

async function updateStock(productid,quantity){
    console.log('productid',productid)
    const product = await Product.findById(productid)
    
    product.stock =  product.stock - quantity
    console.log('product',product)
    product.save({validateBeforeSave:false})
}


//Admin : delete the order - api/v3/orders/deleteorder
exports.deleteorders = CatchAsyncErr(async (req,res,next)=>{
    const order = Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler(`Order not found with this id:${req.params.id}`,404))
    }
    await order.deleteOne()

    res.status(200).json({
        success:true
    })
})
