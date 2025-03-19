const CatchAsyncErr = require("../middlewares/CatchAsyncErr");
const UserModel = require('../models/UserModel');
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const crypto = require('crypto')
const validator = require("validator");

// register user api/v2/register
exports.registerUser = CatchAsyncErr(async (req, res, next) => {
    const { name, email, password, } = req.body

    let avatar;

    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV  === "Production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
    }

    console.log(req.body, avatar)
    const user = await UserModel.create({
        name,
        email,
        password,
        avatar,
    })
    sendToken(user, 201, res)
})

// login user /api/v2/login
exports.loginUser = CatchAsyncErr(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please Enter Email and Password', 400))
    }

    //finding the user database
    const user = await UserModel.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid email and password', 401))
    }

    if (!await user.isValidPassword(password)) {
        return next(new ErrorHandler('Invalid email and password', 401))
    }

    sendToken(user, 201, res)

})

// logout user api/v2/logout
exports.logoutUser = (req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
        .status(200)
        .json({
            success: true,
            message: "Loggedout"
        })

}

// forgot pass /api/v2/password/forgot
exports.forgetPassword = CatchAsyncErr(async (req, res, next) => {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
        next(new ErrorHandler('User not found this email', 404))
    }

    const resetToken = user.getResetToken()
    await user.save({ validateBeforeSave: false })
    console.log('resetToken', resetToken)

    let BASE_URL = process.env.FRONTEND_URL;
   if (process.env.NODE_ENV  === "Production"){
       BASE_URL = `${req.protocol}://${req.get('host')}`
   } 

    //create reset url
    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`

    const message = `Your Password reset url is as follow \n \n
        ${resetUrl} \n\n If you have no requested this email ,then ignore it`

    try {
        sendEmail({
            email: user.email,
            subject: 'Aswin Password Recovery',
            message: message
        })

        res.status(200).json({
            sucess: true,
            message: `Email send to ${user.email}`
        })
    }
    catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500))
    }

})

// resetpass /api/v2/password/reset/token
exports.resetPassword = CatchAsyncErr(async (req, res, next) => {
    console.log("Received Token (plain):", req.params.token);

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex'); // Hash the received token
    console.log("Hashed Token (to compare):", resetPasswordToken);

    const user = await UserModel.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: { $gt: Date.now() }, // Check if token is valid and not expired
    });

    console.log('user',user)

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save({ validateBeforeSave: false });

    sendToken(user, 200, res);
});

//user profile api/v2/myprofile
exports.getUserProfile = CatchAsyncErr(async (req, res, next) => {

    const user = await UserModel.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

//Change Password  - api/v1/password/change
exports.changePassword = CatchAsyncErr(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id).select('+password');
    //check old password
    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('Old password is incorrect', 401));
    }

    //assigning new password
    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        success: true,
    })
})

// update profile 
exports.updateProfile = CatchAsyncErr(async (req, res, next) => {


    console.log('updateProfile 1')
    const { email } = req.body;
    console.log("Received Body:", req.body);
    console.log("Received File:", req.file);


    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    console.log('updateProfile 2')

    let newUserData = {
        name: req.body.name,
        email: req.body.email // Should work, but doesn't trigger email validation in some cases
    }

    let avatar;

    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV  === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
        newUserData={...newUserData,avatar}
    }
   
    const user = await UserModel.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    })
    console.log('updateProfile 3')
    console.log(user)

    res.status(200).json({
        sucess: true,
        user
    })

})

//Admin get all user -/api/v2/admin/user
exports.getAllUsers = CatchAsyncErr(async (req, res, nect) => {
    const user = await UserModel.find();
    res.status(200).json({
        sucess: true,
        user
    })
})

//Admin get specific user -/api/v2/admin/user/id
exports.getUser = CatchAsyncErr(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found witn this id ${req.params.id}`))
    }

    res.status(200).json({
        sucess: true,
        user
    })
})

// Admin: update user -/api/v2/admin/user/id 
exports.updateUser = CatchAsyncErr(async (req, res, next) => {

    const { email } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    const newUserData = {
        name: req.body.name,
        email: req.body.email, // Should work, but doesn't trigger email validation in some cases
        role: req.body.role
    }

    const user = await UserModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    })
    console.log(user)

    res.status(200).json({
        sucess: true,
        user
    })
})

//Admin : Delete User - -/api/v2/admin/user/id

exports.deleteUser = CatchAsyncErr(async (req, res, next) => {

    const user = await UserModel.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found witn this id ${req.params.id}`))
    }

    await user.deleteOne();
    res.status(200).json({
        sucess: true
    })

})












