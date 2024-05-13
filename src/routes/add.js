import express from 'express';
import Notebook from "../models/notebookSchema.js";
import isAuthenticated from "../controllers/isAuthenticated.js";

const router = express.Router();

// GET - ADD the node
router.get("/note/add", (req, res) => {
    // res.send("Enter the tag and description in the modal")
    res.render("addNote");
});

// POST - Add the note in the DB of the current user
router.post("/note/add", isAuthenticated, (req, res) => {
    const { tag, description } = req.body;
    const userId = req.userID; // Assuming you have set the user object in req.user during authentication
    // Create a new notebook document
    const notebook = new Notebook({
        tag,
        description,
        user: userId,
    });
    // Save the notebook to the database
    notebook
        .save()
        .then(() => {
            // res.status(201).json({ message: 'Note added successfully' });
            const noteMessage = "Note added successfully";
            res.redirect("/note/show");
        })
        .catch((error) => {
            console.error("Error adding note:", error);
            // res.status(500).json({ message: 'An error occurred while adding the note' });
            const errorMessage = "An error occurred while adding the notes";
            res.render("error_template", { errorMessage });
        });
});

export default router;
