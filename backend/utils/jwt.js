const sendToken = (user,statuscode,res)=>{

    //creating the JWT Token
    const token = user.getJwtToken()

    //Cookies will apply
    const option = {
         expires : new Date(Date.now() + process.env.COOKIES_EXPIRE_TIME *24*60*60*1000) ,
         httpOnly:true
    }

    res.status(statuscode).cookie('token',token,option).json({
        sucess:true,
        user,
        token
    })
}

module.exports = sendToken