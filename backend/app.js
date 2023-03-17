const express=require("express")
const cookieParser=require("cookie-parser")
const app=express()
app.use(cookieParser())
const bodyparser=require("body-parser")
const fileUpload=require("express-fileupload")
const errorMiddleware=require("./middleware/Error")
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.urlencoded({extended:true}))
app.use(fileUpload())
require("dotenv").config()

//import routes
const products=require("./routes/productRoutes")
const user=require("./routes/userRoute")
const order=require("./routes/orderRoutes")
const payment=require("./routes/paymentRoutes")

app.use("/api/v1",products)
app.use("/api/v1",user)
app.use("/api/v1",order)
app.use("/api/v1",payment)
app.use(errorMiddleware)



module.exports=app