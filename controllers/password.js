import dotenv from "dotenv";
dotenv.config();

import User from "../model/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

console.log("MAIL:", process.env.MAIL);
console.log("PASS:", process.env.PASS);

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
});

const showForgotPasswordForm = (req, res) => {
  res.render("forgot-password", { errorMessage: false });
};

const sendResetLink = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.render("forgot-password", {
      errorMessage: "No account with that email address exists.",
    });
  }

  const token = crypto.randomBytes(20).toString("hex");
  const resetToken = jwt.sign({ userId: user._id }, process.env.JWTSECRETKEY, {
    expiresIn: "1h",
  });

  const resetURL = `http://${req.headers.host}/reset-password/${resetToken}`;

  const mailOptions = {
    to: user.email,
    from: process.env.MAIL,
    subject: "Password Reset",
    text:
      `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
      `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
      `${resetURL}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.render("forgot-password", {
        errorMessage: "Error sending the email. Please try again later.",
      });
    }
    res.render("forgot-password", {
      errorMessage: "A reset link has been sent to your email.",
    });
  });
};

const showResetPasswordForm = (req, res) => {
  const { token } = req.params;
  res.render("reset-password", { token, errorMessage: false });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.render("reset-password", {
        errorMessage: "Invalid token or user does not exist.",
        token,
      });
    }

    if (password.length < 8 || password.length > 20) {
      return res.render("reset-password", {
        errorMessage: "Password length should be between 8 and 20 characters.",
        token,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.render("reset-password", {
      errorMessage: "Password has been successfully reset.",
      token: false,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.render("reset-password", {
      errorMessage: "An error occurred while resetting the password.",
      token,
    });
  }
};

export {
  showForgotPasswordForm,
  sendResetLink,
  showResetPasswordForm,
  resetPassword,
};
