import express from 'express';
const router = express.Router();
import cookieParser from "cookie-parser";

// Logout API endpoint
router.get("/user/logout", (req, res) => {
    // Clear the "token" cookie by providing the cookie name
    res.clearCookie("token");
    // res.json({ message: 'Logout successful' });
    // redirecting to the Home route
    res.redirect("/");
});

export default router;
