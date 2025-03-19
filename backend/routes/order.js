const express = require('express')
const { isAuthenticatedUser, authorizeRole } = require('../middlewares/authenticate')
const { newOrder, getSingleOrder, myorder, orders, updateOrder, deleteorders } = require('../controllers/orderController')
const router = express.Router()

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser,myorder);


//ADMIN routes
router.route('/admin/orders').get(isAuthenticatedUser,authorizeRole('admin'),orders);
router.route('/admin/order/:id').put(isAuthenticatedUser,authorizeRole('admin'),updateOrder)
                            .delete(isAuthenticatedUser,authorizeRole('admin'),deleteorders);

module.exports = router