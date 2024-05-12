import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

const JWT_SECRET_KEY = process.env.JWTSECRETKEY;

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        // Verify and decode the token
        console.log(token);
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        // Access the decrypted data from the token
        const { userId } = decoded;
        // Verifying the user ID with the database
        User.findOne({ _id: userId })
            .then((curr_user) => {
                if (curr_user) {
                    console.log("User is Authorized");
                    // Setting the userID so that any authorized connection can use it
                    req.userID = userId;
                    req.userNAME = curr_user.name;
                    console.log(req.userNAME);
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
        // Cookie does not exist
        console.log("Cookie not found");
        res.status(401).redirect("/");
    }
};

export default isAuthenticated;
