import Notebook from "../model/Notebook.js";

var noteMessage = false;

const getAllNotes = async (req, res) => {
    const userId = req.userID; // Assuming the authenticated user ID is available in req.user._id
    console.log(userId);
    // Find all notes with the user ID
    Notebook.find({ user: userId })
        .then((notes) => {
            // res.status(200).json(notes);
            console.log(notes);
            res.render("note", {
                notes: notes,
                userNAME: req.userNAME,
                successMessage: noteMessage,
            });
            noteMessage = false;
        })
        .catch((error) => {
            console.error("Error fetching notes:", error);
            // res.status(500).json({ message: 'An error occurred while fetching the notes' });
            const errorMessage = "An error occurred while fetching the notes";
            res.render("error_template", { errorMessage });
        });
}
const addNote = async (req, res) => {
    const { tag, description, category } = req.body;
    const userId = req.userID; // Assuming you have set the user object in req.user during authentication
    // Create a new notebook document
    const notebook = new Notebook({
        tag,
        description,
        category,
        user: userId,
    });
    // Save the notebook to the database
    notebook
        .save()
        .then(() => {
            // res.status(201).json({ message: 'Note added successfully' });
            noteMessage = "Note added successfully";
            res.redirect("/note/show");
        })
        .catch((error) => {
            console.error("Error adding note:", error);
            // res.status(500).json({ message: 'An error occurred while adding the note' });
            const errorMessage = "An error occurred while adding the notes";
            res.render("error_template", { errorMessage });
        });
}
const deleteNote = async (req, res) => {
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
            noteMessage = "Note deleted successfully";
            res.redirect("/note/show");
        })
        .catch((error) => {
            console.error("Error deleting note:", error);
            // res.status(500).json({ message: 'An error occurred while deleting the note' });
            const errorMessage = "An error occurred while deleting the note";
            res.render("error_template", { errorMessage });
        });
}
const updateNote = async (req, res) => {
    const userId = req.userID; // Assuming the authenticated user ID is available in req.userID
    const noteId = req.params.noteId; // Get the note ID from the request parameters
    const { tag, description, category } = req.body; // Get the updated tag and description from the request body

    // Find the note by ID and user ID
    Notebook.findOneAndUpdate(
        { _id: noteId, user: userId },
        { tag, description, category },
        { new: true }
    )
        .then((updatedNote) => {
            if (!updatedNote) {
                // Note not found or not authorized to update
                // return res.status(404).json({ message: 'Note not found or unauthorized' });
                const errorMessage = "Note not found or unauthorized";
                return res.render("error_template", { errorMessage });
            }
            // res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
            noteMessage = "Note updated successfully";
            res.redirect("/note/show");
        })
        .catch((error) => {
            console.error("Error updating note:", error);
            // res.status(500).json({ message: 'An error occurred while updating the note' });
            const errorMessage = "An error occurred while updating the note";
            res.render("error_template", { errorMessage });
        });
}
const searchNote = async (req, res) => {
    const userId = req.userID;
    const { tag } = req.query;

    // Find notes with the specified tag and user ID
    Notebook.find({ 
        user: userId,
        tag: { $regex: tag, $options: 'i'}
     })
        .then((notes) => {
            // res.status(200).json(notes);
            res.render("search", { tag, notes });
        })
        .catch((error) => {
            console.error("Error searching notes:", error);
            // res.status(500).json({ message: 'An error occurred while searching notes' });
            const errorMessage = "An error occurred while searching notes";
            res.render("error_template", { errorMessage });
        });
}


export { getAllNotes, addNote, deleteNote, updateNote, searchNote }
