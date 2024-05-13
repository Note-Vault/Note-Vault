import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { config as configDotenv } from "dotenv"; // Use config method from dotenv

configDotenv();
// creating a global variable for success message
var noteMessage = false;

//Declaring all the routes
import homeRoute from "./src/routes/home.js";
import addRoute from "./src/routes/add.js";
import deleteRoute from "./src/routes/delete.js";
import loginRoute from "./src/routes/login.js";
import logoutRoute from "./src/routes/logout.js";
import registerRoute from "./src/routes/register.js";
import searchRoute from "./src/routes/search.js";
import showRoute from "./src/routes/show.js";
import updateRoute from "./src/routes/update.js";

const app = express();
const port = 3000; // Change this to the desired port number

// Middleware to read the body data in json format
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());
// Using EJS as viewEngine
app.set("view engine", "ejs");
// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));
// Serve static files from the 'public' folder
app.use(express.static("public"));

//Use all the routes
app.use("", homeRoute);
app.use("", addRoute);
app.use("", deleteRoute);
app.use("", loginRoute);
app.use("", logoutRoute);
app.use("", registerRoute);
app.use("", searchRoute);
app.use("", showRoute);
app.use("", updateRoute);

mongoose
    .connect(process.env.MONGODBURI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
