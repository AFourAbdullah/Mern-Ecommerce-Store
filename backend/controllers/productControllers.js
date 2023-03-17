const Product=require("../models/productModel")
const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncError=require("../middleware/CatchAsyncErrors")
const ApiFeatures = require("../utils/apiFeatures")
const cloudinary=require("cloudinary")

//get all products
const getAllProducts=catchAsyncError(async(req,res,next)=>{

    const resultPerPage=4;
    const productsCount=await Product.countDocuments()
    const apifeatures=new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage)
   
  // let products = await apifeatures.query;

  // let filteredProductsCount = products.length;

  // apifeatures.pagination(resultPerPage);

 const products = await apifeatures.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    // filteredProductsCount,
  });
})



//get all products admin
const getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

//get single products
const getSingleProduct=catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found",404));
  }

    res.status(200).json({
        success:true,
        product,
    })

}
)


//createProduct admin
const createProduct=catchAsyncError(async(req,res)=>{
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

    req.body.user = req.user.id;
    const product=await Product.create(req.body)
    res.status(201).json({
        success:true,
        product
    })
    }
    )

//update by admin
const updateProduct=catchAsyncError(async(req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found",404));
      }

      if (!product) {
        return next(new ErrorHandler("Product not found",404));
      }
      let images = [];

      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }

      if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
          await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }
    
        const imagesLinks = [];
    
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });
    
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
    
        req.body.images = imagesLinks;
      }
    product =await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,runValidators:true,useFindAndModify:false    })
        res.status(200).json({
            success:true,
            product
        })
})


//delete by admin
const deleteProduct=catchAsyncError(async(req,res,next)=>{
    let product=await Product.findById(req.params.id);
   
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
    await product.remove()
    res.status(200).json({
        success:true,
        mssg:"product deleted successfully"
    })



})

//create product review'

const createProductReview=catchAsyncError(async(req,res,next)=>{
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
})

//get all reviews
const getAllReviews=catchAsyncError(async(req,res,next)=>{
  const product=await Product.findById(req.query.id)
  if (!product) {
    return next(new ErrorHandler("Product not found",404));
  }
  res.status(200).json({
    success: true,
    reviews:  product.reviews
 
  });

})

//deleet review
const deleteReview=catchAsyncError(async(req,res,next)=>{
  const product=await Product.findById(req.query.productId)
  if (!product) {
    return next(new ErrorHandler("Product not found",404));
  }
  const reviews=product.reviews.filter((rev)=>rev._id.toString()!==req.query.id.toString())

  let avg=0;
  reviews.forEach((rev)=>avg+=rev.rating)
  let ratings=0;
  if(reviews.length===0){
    ratings=0;
  }
  else{
     ratings=avg/reviews.length;

  }
  const numOfReviews=reviews.length

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });

})

module.exports={getAllProducts,createProduct,updateProduct,deleteProduct,getSingleProduct,createProductReview,getAllReviews,deleteReview,getAdminProducts}