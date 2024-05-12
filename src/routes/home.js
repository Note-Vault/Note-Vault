import express from 'express';
import isAuthenticatedlogin from "../controllers/isAuthenticatedLogin.js";

const router = express.Router();

// GET - ROOT API
router.get("/", isAuthenticatedlogin, (req, res) => {
    // res.send('Welcome to the NoteVault');
    res.render("home");
});

export default router;
