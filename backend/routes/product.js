const express = require('express')
const { getProducts, newProducts, getSingleProduct, updateProduct, deleteProducts, createReview, getReviews, deleteReview, getAdminproducts } = require('../controllers/ProductController')
const { isAuthenticatedUser, authorizeRole } = require('../middlewares/authenticate')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            //cb means call back
            //first value error kudukanuk ilatha nala null 
            //upload panna pora folder name kudukanum second
            cb(null, path.join(__dirname, '..', 'uploads/product'))
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
})

router.route('/products').get(getProducts)
router.route('/product/:id')
    .get(getSingleProduct)


router.route('/review').put(isAuthenticatedUser, createReview)


//Admin routes
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRole('admin'), upload.array('images'), newProducts)
router.route('/admin/products').get(isAuthenticatedUser, authorizeRole('admin'), getAdminproducts)
router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRole('admin'), deleteProducts)
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRole('admin'), upload.array('images'), updateProduct)
router.route('/admin/reviews').get(isAuthenticatedUser, authorizeRole('admin'),getReviews)
router.route('/admin/review').delete(isAuthenticatedUser, authorizeRole('admin'),deleteReview)

module.exports = router