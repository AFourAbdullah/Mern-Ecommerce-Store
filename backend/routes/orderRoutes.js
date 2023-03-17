const express=require("express")
const { createNewOrder, getSingleOrder, getAllMyOrders, getAllMyOrdersAdmin, updateOrder, deleteOrder } = require("../controllers/orderControllers")
const {isAuthenticatedUser ,authorizedRoles}= require("../middleware/Auth")

const router=express.Router()
router.post("/order/new",isAuthenticatedUser,createNewOrder)
router.get("/order/:id",isAuthenticatedUser,getSingleOrder)
router.get("/orders/me",isAuthenticatedUser,getAllMyOrders)
router.get("/admin/orders",isAuthenticatedUser,authorizedRoles("admin"),getAllMyOrdersAdmin)
router.put("/admin/order/:id",isAuthenticatedUser,authorizedRoles("admin"),updateOrder)
router.delete("/admin/order/:id",isAuthenticatedUser,authorizedRoles("admin"),deleteOrder)


module.exports=router