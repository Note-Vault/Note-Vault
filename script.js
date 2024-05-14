import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { config as configDotenv } from "dotenv";
import PDFDocument from 'pdfkit'; // Import PDFKit for PDF generation
import Notebook from './models/Notebook'; // Import the Notebook model


configDotenv();

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Middleware to verify JWT token and extract user ID
const JWT_SECRET_KEY = process.env.JWTSECRETKEY;

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const { userId } = decoded;
    User.findOne({ _id: userId })
      .then((curr_user) => {
        if (curr_user) {
          req.userID = userId;
          req.userNAME = curr_user.name;
          next();
        } else {
          const errorMessage = "Internal server error";
          res.render("error_template", { errorMessage });
        }
      })
      .catch((error) => {
        console.error("Server down", error);
        const errorMessage = "An error occurred while token verification";
        res.render("error_template", { errorMessage });
      });
  } else {
    console.log("Cookie not found");
    res.status(401).redirect("/");
  }
};

