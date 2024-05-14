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

