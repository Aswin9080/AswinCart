const express = require('express')
const multer = require('multer');
const path = require('path')


const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            //cb means call back
            //first value error kudukanuk ilatha nala null 
            //upload panna pora folder name kudukanum second
            cb(null, path.join(__dirname, '..', 'uploads/user'))
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
})



const { registerUser,
    loginUser,
    logoutUser,
    forgetPassword,
    resetPassword,
    getUserProfile,
    changePassword,
    updateProfile } = require('../controllers/AuthController')
const { isAuthenticatedUser, authorizeRole } = require('../middlewares/authenticate')
const { getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/AuthController')

const router = express.Router()

//single file upload panradhu single use panrom 
router.route('/register').post(upload.single('avatar'), registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/password/forgot').post(forgetPassword)
router.route('/password/reset/:token').post(resetPassword)
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile)
router.route('/password/change').put(isAuthenticatedUser, changePassword)
router.route('/updateProfile').put(isAuthenticatedUser,upload.single('avatar'), updateProfile)


//Adin routes
router.route('/admin/user').get(isAuthenticatedUser, authorizeRole('admin'), getAllUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRole('admin'), getUser)
    .put(isAuthenticatedUser, authorizeRole('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRole('admin'), deleteUser);


module.exports = router