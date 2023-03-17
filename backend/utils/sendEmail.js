const nodemailer=require("nodemailer")
const sendEmail=async(options)=>{
    const transporter=nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secure: false,
    requireTLS: true,
        service:process.env.SMPT_SERVICE,
        auth:{
           user:process.env.SMPT_MAIL,pass:process.env.SMPT_PASSWORD
        }
    })
    const mailOptions={
        from:process.env.SMPT_MAIL,
        to:options.emal,
        text:options.message,
        subject:options.subject
    } 
    await transporter.sendMail(mailOptions)
  
}
module.exports=sendEmail