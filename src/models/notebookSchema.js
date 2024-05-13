// notebookSchema.js

import mongoose from 'mongoose';

const notebookSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Notebook = mongoose.model("Notebook", notebookSchema);

export default Notebook;
