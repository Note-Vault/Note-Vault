import { Schema, model } from 'mongoose';
const notebookSchema = new Schema({
    tag: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     category: {
      type: String,
      default: "General",
    },
  });
  
export default model("Notebook", notebookSchema);
