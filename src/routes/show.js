import express from 'express';
import Notebook from "../models/notebookSchema.js";
import isAuthenticated from "../controllers/isAuthenticated.js";

const router = express.Router();

// GET - Show all notes from the DB
router.get("/note/show", isAuthenticated, async (req, res) => {
    try {
        const userId = req.userID; // Assuming the authenticated user ID is available in req.user._id
        console.log(userId);
        // Find all notes with the user ID
        const notes = await Notebook.find({ user: userId });
        console.log(notes);
        res.render("note", {
            notes: notes,
            userNAME: req.userNAME,
            successMessage: false,
        });
        const noteMessage = false;
    } catch (error) {
        console.error("Error fetching notes:", error);
        const errorMessage = "An error occurred while fetching the notes";
        res.render("error_template", { errorMessage });
    }
});

export default router;
