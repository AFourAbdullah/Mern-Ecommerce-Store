const ErrorHandler = require("../utils/ErrorHandler");
const CatchAsyncErrors = require("./CatchAsyncErrors");
const jwt=require("jsonwebtoken")
const User=require("../models/userModel");


const isAuthenticatedUser=CatchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        next(new ErrorHandler("please login to access this resource",401))
    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRET)
   req.user= await User.findById(decodedData.id)
   next()
})
const authorizedRoles=(...roles)=>{
 return   (req,res,next)=>{
    if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();
 }

}
module.exports={isAuthenticatedUser,authorizedRoles}