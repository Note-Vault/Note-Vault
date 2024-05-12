import express from 'express';
import Notebook from "../models/notebookSchema.js";
import isAuthenticated from "../controllers/isAuthenticated.js";

const router = express.Router();

// Search Functionality by the tag name
// searching the URL using query params
// localhost:3000/note/search?tag=searching
// it returns only the result of array if the tag name is exactly matched with the query
router.get("/note/search", isAuthenticated, async (req, res) => {
    try {
        const userId = req.userID;
        const { tag } = req.query;

        // Find notes with the specified tag and user ID
        const notes = await Notebook.find({ tag, user: userId });

        // res.status(200).json(notes);
        res.render("search", { tag, notes });
    } catch (error) {
        console.error("Error searching notes:", error);
        const errorMessage = "An error occurred while searching notes";
        res.render("error_template", { errorMessage });
    }
});

export default router;
