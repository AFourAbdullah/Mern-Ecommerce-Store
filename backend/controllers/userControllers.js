const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncError=require("../middleware/CatchAsyncErrors")
const User=require("../models/userModel")
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const cloudinary=require("cloudinary");
const userModel = require("../models/userModel");
//registering user

const registerUser=catchAsyncError(async(req,res,next)=>{
  const mycloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
    folder:"avatars",width:150,crop:"scale"
  })
    const {name,email,password}=req.body;
    const user=await User.create({
        name,email,password,avatar:{
            public_id:mycloud.public_id,url:mycloud.secure_url
        }
    });
    sendToken(user,201,res)
  


})

//login user

const loginUser=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return next(new ErrorHandler("Please enter both email and password",400))
    }
    const user=await userModel.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401))
    }
    const isPasswordMatced=user.comparePassword(password);
    if(!isPasswordMatced){
        return next(new ErrorHandler("Invalid email or password",401))
    }
    sendToken(user,200,res)
})


//logout

const logout=catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged out"
    })
})


//forgot password


const forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken =await user.generateResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHandler(error.message, 500));
    }
  });


  // Reset Password
const resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not password", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });
  
//get user details

const getUserDetails=catchAsyncError(async(req,res,next)=>{
  const user=await User.findById(req.user.id)
  res.status(200).json({
    success:true,
    user
  })
})

//update password
const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});


//update user
const updateUser=catchAsyncError(async(req,res,next)=>{
  const newUserData={
    name:req.body.name,
    email:req.body.email
  }
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }


  const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,useFindAndModify:false
  })
  res.status(200).json({
    success:true,
    
  })

})

const getAllUsers=catchAsyncError(async(req,res,next)=>{
  const users=await User.find();
  res.status(200).json({
    success:true,
    users
  })
})


const getSingleUser=catchAsyncError(async(req,res,next)=>{
  const user=await User.findById(req.params.id);
   if (!user) {
      return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
      success:true,
      user
    })
  
})

//update user role --admin
const updateUserRole=catchAsyncError(async(req,res,next)=>{
  const newUserData={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }

  const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
    new:true,
    runValidators:true,useFindAndModify:false
  })
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    success:true,
    
  })

})

//delete user
const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

module.exports={registerUser,loginUser,logout,forgotPassword,resetPassword,getUserDetails,updatePassword,updateUser,getAllUsers,getSingleUser,updateUserRole,deleteUser}


//abc21  password1234