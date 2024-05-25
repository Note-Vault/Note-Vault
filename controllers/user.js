import User from '../model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    // Check if user with the same email already exists
    User.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                // return res.status(400).json({ message: 'Email already registered' });
                return res.render("register", {
                    errorMessage: "Email already registered.Login Directly",
                });
            }
            //Password Length Validation

            if (password.length < 8 || password.length > 20) {
                return res.render("register", {
                    errorMessage: "Password Length should be greater than 8 and less than 20",
                });
            }

            // Hash the password

            bcrypt.hash(password, 10)
                .then((hashedPassword) => {
                    // Create a new user with hashed password
                    const user = new User({
                        name,
                        email,
                        password: hashedPassword,
                    });

                    // Save the user to the database
                    user
                        .save()
                        .then(() => {
                            // Generate JWT token with user ID
                            const token = jwt.sign({ userId: user._id }, process.env.JWTSECRETKEY);

                            // Set the token as a cookie
                            res.cookie("token", token, { httpOnly: true });
                            // res.status(201).json({ message: 'User registered successfully' });
                            res.render("success");
                        })
                        .catch((error) => {
                            console.error("Error registering user:", error);
                            // res.status(500).json({ message: 'An error occurred while registering user' });
                            res.render("register", {
                                errorMessage: "An error occurred while registering user",
                            });
                        });
                })
                .catch((error) => {
                    console.error("Error hashing password:", error);
                    // res.status(500).json({ message: 'An error occurred while hashing password' });
                    res.render("register", {
                        errorMessage: "An error occurred while hashing password",
                    });
                });
        })
        .catch((error) => {
            console.error("Error checking existing user:", error);
            // res.status(500).json({ message: 'An error occurred while registering user' });
            res.render("register", {
                errorMessage: "An error occurred while checking existing user",
            });
        });
}
const login = async (req, res) => {
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
            bcrypt.compare(password, user.password)
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
}
const logout = async (req, res) => {
    // Clear the "token" cookie by providing the cookie name
    res.clearCookie("token");
    // res.json({ message: 'Logout successful' });
    // redirecting to the Home route
    res.redirect("/");
}

export { register, login, logout };