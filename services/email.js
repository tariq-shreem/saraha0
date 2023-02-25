const nodemailer = require("nodemailer");

const sendEamil =async (dest,subject,message)=>{
    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
          user: process.env.SENDEREMAIL, // generated ethereal user
          pass: process.env.SENDEREMAILPASSWORD, // generated ethereal password
        },
      });
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"Saraha app" <${process.env.SENDEREMAIL}>`, // sender address
        to: dest, // list of receivers
        subject: subject, // Subject line
        html: message, // html body
      });
    
}
module.exports={sendEamil}