const mongoose= require('mongoose')

const ConnectDatabase = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
       
        autoIndex: true,
    })
    .then((con)=>console.log(`MongoDB is connected to the Host : ${con.connection.host}`))
    .catch((err)=>console.log(err))
   
}

module.exports = ConnectDatabase