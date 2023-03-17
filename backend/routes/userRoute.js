const express=require("express")
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateUser, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userControllers")
const {isAuthenticatedUser ,authorizedRoles}= require("../middleware/Auth")

const router=express.Router()
router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/password/forgot",forgotPassword)
router.get("/logout",logout)
router.put("/password/reset/:token",resetPassword)
router.get("/me",isAuthenticatedUser, getUserDetails)
router.put("/password/update",isAuthenticatedUser,updatePassword)
router.put("/me/update",isAuthenticatedUser,updateUser)
router.get("/admin/users",isAuthenticatedUser,authorizedRoles("admin"),getAllUsers)
router.get("/admin/user/:id",isAuthenticatedUser,authorizedRoles("admin"),getSingleUser)
router.put("/admin/user/:id",isAuthenticatedUser,authorizedRoles("admin"),updateUserRole)
router.delete("/admin/user/:id",isAuthenticatedUser,authorizedRoles("admin"),deleteUser)
module.exports=router

//admin abc123@gmail.com password1234

//user abc91@gmail.com  password1234