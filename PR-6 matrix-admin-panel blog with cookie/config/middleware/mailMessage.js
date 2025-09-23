const nodemailer=require("nodemailer")
module.exports.sendEmail =  async (msg) =>{
    const transporter = nodemailer.createTransport({
  port: 587,
  service : "gmail",
  secure: false, 
  auth: {
    user: "savanisarthak275@gmail.com",
    pass: "zemhaqqpljpzgaip", 
  },
});
let res = await transporter.sendMail(msg);
return res;
}