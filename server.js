import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { config as configDotenv } from "dotenv"; // Use config method from dotenv
import userRoutes from './routes/user.js';
import staticRoutes from './routes/staticRoutes.js';
import NotebookRoutes from './routes/notebook.js';

configDotenv();
configDotenv({ path: ".env" });

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

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

//Routes
app.use('/',staticRoutes);
app.use('/',userRoutes);
app.use('/',NotebookRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Custom error handler for 404 Not Found
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});
