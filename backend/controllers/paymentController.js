const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncError=require("../middleware/CatchAsyncErrors")
const stripe=require("stripe")(process.env.STRIPE_SECRET_KEY)
const processPayment=catchAsyncError(async(req,res,next)=>{
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        metadata: {
          company: "Ecommerce",
        },
      });
    
      res
        .status(200)
        .json({ success: true, client_secret: myPayment.client_secret });
})

const sendStripeApiKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});

module.exports={processPayment,sendStripeApiKey}