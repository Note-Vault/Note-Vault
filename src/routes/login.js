import bcrypt from "bcrypt";
import express from 'express';
import jwt from "jsonwebtoken";
import isAuthenticatedLogin from "../controllers/isAuthenticatedLogin.js";
import User from "../models/userSchema.js"; // Assuming User is exported as default from userSchema.js

const router = express.Router();

// GET -> Login Page
router.get("/user/login", isAuthenticatedLogin, (req, res) => {
    // res.send("Welcome to the login page")
    res.render("login", { errorMessage: false });
});

// POST ->Login Page
router.post("/user/login", (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    User.findOne({ email })
        .then((user) => {
            if (!user) {
                // return res.status(404).json({ message: 'User not found' });
                return res.render("login", {
                    errorMessage: "User Not Exist.Register first",
                });
            }

            // Compare the provided password with the hashed password in the database
            bcrypt
                .compare(password, user.password)
                .then((isMatch) => {
                    if (!isMatch) {
                        // return res.status(401).json({ message: 'Invalid password' });
                        return res.render("login", { errorMessage: "Invalid Password" });
                    }

                    // Generate JWT token
                    const token = jwt.sign({ userId: user._id }, process.env.JWTSECRETKEY);

                    // Set the token as a cookie
                    res.cookie("token", token, { httpOnly: true });
                    res.status(200).redirect("/note/show");
                })
                .catch((error) => {
                    console.error("Error comparing passwords:", error);
                    // res.status(500).json({ message: 'An error occurred while comparing passwords' });
                    // return res.render('login', { errorMessage: "Internal Server Error" });
                    const errorMessage = "Internal Server Error";
                    res.render("error_template", { errorMessage });
                });
        })
        .catch((error) => {
            console.error("Error finding user:", error);
            // res.status(500).json({ message: 'An error occurred while finding user' });
            // return res.render('login', { errorMessage: "Internal Server Error" });
            const errorMessage = "Internal Server Error";
            res.render("error_template", { errorMessage });
        });
});

export default router;
