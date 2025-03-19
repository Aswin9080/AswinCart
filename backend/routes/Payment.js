const express = require('express');
const { PaymentIntegraion, verifyPayment } = require('../controllers/PaymentController');
const { isAuthenticatedUser } = require('../middlewares/authenticate');
const router = express.Router()

router.route('/payment/process').post(isAuthenticatedUser,PaymentIntegraion);
router.route('/verify').post(isAuthenticatedUser,verifyPayment);

module.exports = router