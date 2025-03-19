const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter product name'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed  100 character']
    },
    price: {
        type: Number,
        default: 0.0,
    },
    description: {
        type: String,
        required: [true, 'Please Enetr the product Description'],
    },
    ratings: {
        type: String,
        default: 0
    },
    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'please enter product category'],
        enum: {
            values: [
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: 'Plaese select correct category'
        }
    },
    seller: {
        type: String,
        required: [true, 'please enetr product seller']
    },
    stock: {
        type: Number,
        required: [true, 'please enter the product stock'],
        maxlength: [20, 'product stock cannot exceed 20']
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId
    },
    
    createAt: {
        type: Date,
        default: Date.now()
    }

})

let schema = mongoose.model('Product', productSchema)
module.exports = schema
