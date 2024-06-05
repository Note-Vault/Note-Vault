import dotenv from "dotenv";
dotenv.config();

import User from "../model/User.js"; 
import nodemailer from "nodemailer"; 

console.log("MAIL:", process.env.MAIL);
console.log("PASS:", process.env.PASS);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
});
const sendVerificationOtp = async (email,otp) => {
    console.log("EMAILFROMSED")
    console.log(email)
    const user = await User.findOne({ email });
  
    if (!user) {
      return ("verify-email", {
        errorMessage: "No account with that email address exists.",
      });
    }
   
  
    const mailOptions = {
      to: email,
      from: process.env.MAIL,
      subject: "Email Verification",
      text:
        `You are receiving this because you (or someone else) have requested to verify the email for your account.\n\n` +
        `Your OTP is: ${otp}\n\n` +
        `If you did not request this, please ignore this email.\n`,
    };
  
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("Error sending email:", err);
      }
    });
  };

export{
    sendVerificationOtp
}
  