const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErr = require("./CatchAsyncErr");
const User = require('../models/UserModel')


exports.isAuthenticatedUser = CatchAsyncErr(async (req,res,next)=>{
    const {token} = req.cookies
    
    if(!token){
        return next(new ErrorHandler('Login First to handle this resourse',401))
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRETE);
    req.user = await User.findById(decoded.id);
    next()
})


exports.authorizeRole = (...roles)=>{
    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed`,401))
        }
        next()
    }
}