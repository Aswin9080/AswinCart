
const ConnectDatabase = require('../config/database')
const prodcuts = require('../data/products.json')
const Product = require('../models/ProductModels')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({path:path.join(__dirname,'../config/config.env')})
ConnectDatabase()


const seedProducts = async()=>{

    try{
        await Product.deleteMany()
        console.log('products deleted')
        const product = await Product.insertMany(prodcuts)
        console.log('products inserted')
    }
    catch(error){
       console.log(error.message)
    }
    process.exit()
    
}


seedProducts()