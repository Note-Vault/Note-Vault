import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { getAllNotes, addNote, deleteNote, updateNote, searchNote } from '../controllers/notebook.js';
const router = express.Router();

router.get("/note/show", isAuthenticated, getAllNotes);

// POST - Add the note in the DB of the current user
router.post("/note/add", isAuthenticated, addNote);

// DELETE - Delete a note
router.post("/note/delete/:noteId", isAuthenticated, deleteNote);

// PUT - Update a note
router.post("/note/update/:noteId", isAuthenticated, updateNote);

// Search Functionality by the tag name
// searching the the URL using query params
// localhost:3000/note/search?tag=searching
// it returns only the result of array if the tag name is exactly matched with the query
router.get("/note/search", isAuthenticated, searchNote);

export default router;