import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { config as configDotenv } from "dotenv";
configDotenv();

const router = express.Router();

console.log(process.env.JWTSECRETKEY)

// GET Register Page
router.get("/user/register", (req, res) => {
    res.render("register", { errorMessage: false });
});

// POST Registering User in the database
router.post("/user/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("register", {
                errorMessage: "Email already registered. Login directly",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with hashed password
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await user.save();

        // Generate JWT token with user ID
        const token = jwt.sign({ userId: user._id }, process.env.JWTSECRETKEY);

        // Set the token as a cookie
        res.cookie("token", token, { httpOnly: true });
        res.render("success");
    } catch (error) {
        console.error("Error registering user:", error);
        res.render("register", { errorMessage: "An error occurred while registering user" });
    }
});

export default router;
