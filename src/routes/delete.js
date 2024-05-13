import express from 'express';
import Notebook from "../models/notebookSchema.js";
import isAuthenticated from "../controllers/isAuthenticated.js";

const router = express.Router();

// DELETE - Delete a note
router.post("/note/delete/:noteId", isAuthenticated, (req, res) => {
    const userId = req.userID; // Assuming the authenticated user ID is available in req.userID
    const noteId = req.params.noteId; // Get the note ID from the request parameters

    // Find the note by ID and user ID
    Notebook.findOneAndDelete({ _id: noteId, user: userId })
        .then((deletedNote) => {
            if (!deletedNote) {
                // Note not found or not authorized to delete
                // return res.status(404).json({ message: 'Note not found or unauthorized' });
                const errorMessage = "Note not found or unauthorized";
                return res.render("error_template", { errorMessage });
            }
            // res.status(200).json({ message: 'Note deleted successfully' });
            const noteMessage = "Note deleted successfully";
            res.redirect("/note/show");
        })
        .catch((error) => {
            console.error("Error deleting note:", error);
            // res.status(500).json({ message: 'An error occurred while deleting the note' });
            const errorMessage = "An error occurred while deleting the note";
            res.render("error_template", { errorMessage });
        });
});

export default router;
