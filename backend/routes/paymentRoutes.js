const express=require("express")
const { processPayment, sendStripeApiKey } = require("../controllers/paymentController")
const router=express.Router()
const {isAuthenticatedUser ,authorizedRoles}= require("../middleware/Auth")
router.post("/payment/process",isAuthenticatedUser,processPayment)
router.get("/stripeapikey",isAuthenticatedUser, sendStripeApiKey);
module.exports=router