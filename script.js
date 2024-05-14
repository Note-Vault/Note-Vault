import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { config as configDotenv } from "dotenv";
import PDFDocument from 'pdfkit'; // Import PDFKit for PDF generation
import Notebook from './models/Notebook'; // Import the Notebook model


