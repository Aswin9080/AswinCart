const Razorpay = require('razorpay')
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErr = require('../middlewares/CatchAsyncErr')
const crypto = require('crypto');


exports.PaymentIntegraion = CatchAsyncErr(async (req, res, next) => {
    try {

        const razorpayInstance = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        })
        const options = {
            amount: req.body.amount * 100,
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex'),
            payment_capture: 1
        };

        await razorpayInstance.orders.create(options, (error, data) => {

            if (error) {
                return next(new ErrorHandler("Order Creation Failed", error), 500);

            }
            else {
                res.status(200).json({
                    data: data
                })
            }

        })
    }
    catch (err) {
        return next(new ErrorHandler("Internal server Error", 500));
    }
})

// Verify payment API
exports.verifyPayment = CatchAsyncErr(async (req, res, next) => {
    try {
        
        const { payment_id, order_id, signature } = req.body;

        // Razorpay signature verification
        const generatedSignature = crypto.createHmac('sha256', 'ELadpoLnLpfx61YXBoraLIE1')
            .update(order_id + "|" + payment_id)
            .digest('hex');

        if (generatedSignature === signature) {
            // Payment is verified
            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (err) {
        return next(new ErrorHandler("Payment verification failed", 500));
    }
});
