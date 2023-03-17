
const express=require("express")
const router=express.Router()

const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct, createProductReview, getAllReviews, deleteReview, getAllProductsAdmin, getAdminProducts } = require("../controllers/productControllers")
const {isAuthenticatedUser ,authorizedRoles}= require("../middleware/Auth")

router.get("/products", getAllProducts)
router.get("/product/:id",getSingleProduct)
router.post("/admin/products/new",isAuthenticatedUser,authorizedRoles("admin"), createProduct)
router.put("/admin/product/:id",isAuthenticatedUser,authorizedRoles("admin"), updateProduct)
router.delete("/admin/product/:id",isAuthenticatedUser,authorizedRoles("admin"), deleteProduct)
router.put("/review",isAuthenticatedUser,createProductReview)
router.get("/reviews",getAllReviews)
router.delete("/reviews",isAuthenticatedUser,deleteReview)
router.get("/admin/products",isAuthenticatedUser,authorizedRoles("admin"),getAdminProducts)
module.exports=router  