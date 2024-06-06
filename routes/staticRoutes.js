import express from 'express';
import isAuthenticatedlogin from '../middleware/isAuthenticatedlogin.js';

const router = express.Router();

router.get("/user/register", (req, res) => {
    // res.send("Welcome to the registration page");
    res.render("register", { errorMessage: false });
});

router.get("/user/login", isAuthenticatedlogin, (req, res) => {
    // res.send("Welcome to the login page")
    res.render("login", { errorMessage: false });
});

router.get("/note/add", (req, res) => {
    // res.send("Enter the tag and description in the modal")
    res.render("addNote");
});
router.get("/", isAuthenticatedlogin, (req, res) => {
    // res.send('Welcome to the NoteVault');
    res.render("home");
});
router.get("/pro",(req,res)=>{
    res.render("pricing");
})

export default router;