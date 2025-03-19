
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the name']
    },

    email: {
        type: String,
        required: [true,'please enter the email'],
        unique:true,
        validator: [validator.isEmail, 'please enter valida email']
    },
    
    password: {
        type: String,
        required: [true, 'please enter the password'],
        maxlength: [6, 'password cannot exceed 6 character'],
        select:false
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,

    createdAt: {
        type: Date,
        default: Date.now
    },

})


UserSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password  = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRETE,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}

UserSchema.methods.isValidPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}



UserSchema.methods.getResetToken = function () {
    const token = crypto.randomBytes(20).toString('hex'); // Plain token
    console.log("Generated Token (plain):", token);

    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex'); // Hash the token
    console.log("Hashed Token (saved to DB):", this.resetPasswordToken);

    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000; // 30 minutes expiry

    return token; // Return plain token
};



const model = mongoose.model('User', UserSchema)

module.exports = model