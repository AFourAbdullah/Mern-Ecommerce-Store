const mongoose=require("mongoose");
const conenctDB=()=>{

    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).then((data)=>{
        console.log(`mongodb connected to  ${data.connection.host}`)
    
      })
}
module.exports=conenctDB