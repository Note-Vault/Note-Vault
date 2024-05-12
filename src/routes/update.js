import express from 'express';
import Notebook from "../models/notebookSchema.js";
import isAuthenticated from "../controllers/isAuthenticated.js";

const router = express.Router();

// PUT - Update a note
router.post("/note/update/:noteId", isAuthenticated, async (req, res) => {
    try {
        const userId = req.userID; // Assuming the authenticated user ID is available in req.userID
        const noteId = req.params.noteId; // Get the note ID from the request parameters
        const { tag, description } = req.body; // Get the updated tag and description from the request body

        // Find the note by ID and user ID
        const updatedNote = await Notebook.findOneAndUpdate(
            { _id: noteId, user: userId },
            { tag, description },
            { new: true }
        );

        if (!updatedNote) {
            // Note not found or not authorized to update
            const errorMessage = "Note not found or unauthorized";
            return res.render("error_template", { errorMessage });
        }
        // res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
        const noteMessage = "Note updated successfully";
        res.redirect("/note/show");
    } catch (error) {
        console.error("Error updating note:", error);
        const errorMessage = "An error occurred while updating the note";
        res.render("error_template", { errorMessage });
    }
});

export default router;
