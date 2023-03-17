const app=require("./app");
const cors=require("cors")
const cloudinary=require("cloudinary")
app.use(cors())

const conenctDB = require("./database");
require("dotenv").config()
conenctDB()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is listening on ${process.env.PORT}`)
})

// console.log(youtube)
//unhandle 
process.on("unhandledRejection",err=>{
    console.log(`error :${err.message}`)
    console.log("shutting down the server")
    server.close(()=>{
        process.exit(1)
    })
})
