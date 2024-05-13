import express from 'express';

const router = express.Router();

// GET - ROOT API
router.get("/",  (req, res) => {
    // res.send('Welcome to the NoteVault');
    res.render("home");
});

export default router; 
