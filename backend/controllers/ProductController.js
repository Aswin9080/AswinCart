
const CatchAsyncErr = require('../middlewares/CatchAsyncErr')
const Product = require('../models/ProductModels')
const ApiFeatures = require('../utils/ApiFeatures')
const ErrorHandler = require('../utils/errorHandler')



//get the product api/v1/products
exports.getProducts = async (req, res, next) => {

   let resperpage = 3;
   try {
      // let apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().paginate(resperpage)

      let buildQuesry = () => {
         return new ApiFeatures(Product.find(), req.query).search().filter()
      }

      const filterProductsCount = await buildQuesry().query.countDocuments()
      const totalProductCount = await Product.countDocuments()

      let productsCount = totalProductCount

      if (filterProductsCount !== totalProductCount) {
         productsCount = filterProductsCount
      }
      let products = await buildQuesry().paginate(resperpage).query
      // await new Promise (resolve =>setTimeout(resolve,3000))
      // return next(new ErrorHandler('unable the product',404))

      res.status(200).json({
         sucess: true,
         message: 'This route will show all the products',
         count: productsCount,
         resperpage: resperpage,
         product: products
      })
   }
   catch (err) {
      next(err)
   }

}


// create-product  api/v1/product/new
exports.newProducts = CatchAsyncErr(async (req, res, next) => {

   let images = []
   let BASE_URL = process.env.BACKEND_URL;
   if (process.env.NODE_ENV  === "Production"){
       BASE_URL = `${req.protocol}://${req.get('host')}`
   }

   if (req.files.length > 0) {
      req.files.forEach(file => {
         let url = `${BASE_URL}/uploads/product/${file.originalname}`
         images.push({ image: url })
      })
   }

   req.body.images = images;

   req.body.user = req.user.id
   const product = await Product.create(req.body);
   res.status(200).json({
      sucess: true,
      product: product
   })
})




// get single product  api/v1/product/id

exports.getSingleProduct = async (req, res, next) => {

   try {
      const product = await Product.findById(req.params.id).populate('reviews.user', 'name email');
      console.log('product', product)

      if (!product) {
         return next(new ErrorHandler("Product not found", 404));
      }

      res.status(200).json({
         success: true,
         product: product,
      });
   }
   catch (error) {

      next(error);
   }
};


//update products  api/v1/product/id
exports.updateProduct = async (req, res, next) => {
   let product = await Product.findById(req.params.id)

   let images = []

   //If images not cleared we keep exicited images
   if (req.body.imagesCleared === 'false') {
      images = product.images;
   }
   let BASE_URL = process.env.BACKEND_URL;
   if (process.env.NODE_ENV  === "Production"){
       BASE_URL = `${req.protocol}://${req.get('host')}`
   }

   if (req.files.length > 0) {
      req.files.forEach(file => {
         let url = `${BASE_URL}/uploads/product/${file.originalname}`
         images.push({ image: url })
      })
   }

   req.body.images = images;

   if (!product) {
      return res.status(404).json({
         success: false,
         message: 'product not found'
      })
   }

   product = await Product.findByIdAndUpdate(req.params.id, req.body,
      {
         new: true,
         runValidators: true
      })
   res.status(200).json({
      sucess: true,
      product: product
   })
}

exports.deleteProducts = async (req, res, next) => {

   let product = await Product.findById(req.params.id)
   console.log('product', product)
   if (!product) {
      return res.status(404).json({
         success: false,
         message: 'product not found'
      })
   }

   await Product.findByIdAndDelete(req.params.id);

   res.status(200).json({
      sucess: true,
      message: 'Product deleted',
      product
   })

}

//Create Review - api/v1/review
exports.createReview = CatchAsyncErr(async (req, res, next) => {
   const { productId, rating, comment } = req.body;
   console.log('productId, rating, comment', productId, rating, comment)

   const review = {
      user: req.user.id,
      rating,
      comment
   }

   const product = await Product.findById(productId);
   //finding user review exists
   const isReviewed = product.reviews.find(review => {
      return review.user.toString() == req.user.id.toString()
   })

   if (isReviewed) {
      //updating the  review
      product.reviews.forEach(review => {
         if (review.user.toString() == req.user.id.toString()) {
            review.comment = comment
            review.rating = rating
         }

      })

   } else {
      //creating the review
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
   }
   //find the average of the product reviews
   product.ratings = product.reviews.reduce((acc, review) => {
      return review.rating + acc;
   }, 0) / product.reviews.length;
   product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

   await product.save({ validateBeforeSave: false });

   res.status(200).json({
      success: true
   })
})

//Get reviews - api/v1/reviews
exports.getReviews = CatchAsyncErr(async (req, res, next) => {
   const product = await Product.findById(req.query.id).populate('reviews.user', 'name email')
   res.status(200).json({
      success: true,
      reviews: product.reviews
   })

})
// Delete reviews /api/v1/review

exports.deleteReview = CatchAsyncErr(async (req, res, next) => {


   console.log(req)
   const product = await Product.findById(req.query.productID)
   console.log('product', product)

   //filtering the review which does match the deleteing review id

   const reviews = product.reviews.filter(review => {
      return review._id.toString() !== req.query.id
   })
   console.log('reviews', reviews)
   //number of reviews
   const numOfReviews = reviews.length;

   //finding the avaerage with filtering review 
   let ratings = product.reviews.reduce((acc, review) => {
      return review.rating + acc;
   }, 0) / reviews.length;
   product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

   //save the product
   await Product.findByIdAndUpdate(req.query.productID, {
      reviews,
      numOfReviews,
      ratings
   })

   res.status(200).json({
      success: true
   })

})

// get Admin products - api/v1/admin/products
exports.getAdminproducts = CatchAsyncErr(async (req, res, next) => {
   const products = await Product.find()
   res.status(200).send({
      sucess: true,
      products
   })
})