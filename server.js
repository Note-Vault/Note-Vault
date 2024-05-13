import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { config as configDotenv } from "dotenv"; // Use config method from dotenv


configDotenv();
// creating a global variable for success message
var noteMessage = false;

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const app = express();
const port = 3000; // Change this to the desired port number

// Middleware to read the body data in json format
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());
// Using EJS as viewEngine
app.set("view engine", "ejs");
// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));
// Serve static files from the 'public' folder
app.use(express.static("public"));

// -------------------------------------USER-----------------------------------------------
// --------------------------------USER SCHEMA AND MODEL ----------------------------------
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

// --------------------------------USER SCHEMA AND MODEL ----------------------------------

// --------------------------------NOTEBOOK SCHEMA AND MODEL-------------------------------

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

// --------------------------------NOTEBOOK SCHEMA AND MODEL-------------------------------

// ---------------------------------------MIDDLEWARES--------------------------------------

const JWT_SECRET_KEY = process.env.JWTSECRETKEY;

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    // Verify and decode the token
    console.log(token);
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    // Access the decrypted data from the token
    const { userId } = decoded;
    // Verifying the user ID with the database
    User.findOne({ _id: userId })
      .then((curr_user) => {
        if (curr_user) {
          console.log("User is Authorzied");
          // setting the userID so that any authrized connection can use it
          req.userID = userId;
          req.userNAME = curr_user.name;
          console.log(req.userNAME);
          next();
        } else {
          // res.send("Internal server error")
          const errorMessage = "Internal server error";
          res.render("error_template", { errorMessage });
        }
      })
      .catch((error) => {
        console.error("Server down", error);
        // res.status(500).json({ message: 'An error occurred while token verification' });
        const errorMessage = "An error occurred while token verification";
        res.render("error_template", { errorMessage });
      });
  } else {
    // Cookie does not exist
    console.log("Cookie not found");
    res.status(401).redirect("/");
  }
};

const isAuthenticatedlogin = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    // Verify and decode the token
    console.log(token);
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    // Access the decrypted data from the token
    const { userId } = decoded;
    // Verifying the user ID with the database
    User.findOne({ _id: userId })
      .then((curr_user) => {
        if (curr_user) {
          console.log("User is Authorzied");
          // setting the userID so that any authrized connection can use it
          req.userID = userId;
          req.userNAME = curr_user.name;
          console.log(req.userNAME);
          res.status(200).redirect("/note/show");
        } else {
          // res.send("Internal server error")
          const errorMessage = "Internal server error";
          res.render("error_template", { errorMessage });
        }
      })
      .catch((error) => {
        console.error("Server down", error);
        // res.status(500).json({ message: 'An error occurred while token verification' });
        const errorMessage = "An error occurred while token verification";
        res.render("error_template", { errorMessage });
      });
  } else {
    // Cookie does not exist
    console.log("Cookie not found");
    next();
  }
};

// ---------------------------------------MIDDLEWARES--------------------------------------

// -----------------------------------USER APIS--------------------------------------------

// GET  Register Page
app.get("/user/register", (req, res) => {
  // res.send("Welcome to the registration page");
  res.render("register", { errorMessage: false });
});

// POST -Registering User in the database
app.post("/user/register", (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  // Check if user with the same email already exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        // return res.status(400).json({ message: 'Email already registered' });
        return res.render("register", {
          errorMessage: "Email already registered.Login Directly",
        });
      }

      // Hash the password
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          // Create a new user with hashed password
          const user = new User({
            name,
            email,
            password: hashedPassword,
          });

          // Save the user to the database
          user
            .save()
            .then(() => {
              // Generate JWT token with user ID
              const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);

              // Set the token as a cookie
              res.cookie("token", token, { httpOnly: true });
              // res.status(201).json({ message: 'User registered successfully' });
              res.render("success");
            })
            .catch((error) => {
              console.error("Error registering user:", error);
              // res.status(500).json({ message: 'An error occurred while registering user' });
              res.render("register", {
                errorMessage: "An error occurred while registering user",
              });
            });
        })
        .catch((error) => {
          console.error("Error hashing password:", error);
          // res.status(500).json({ message: 'An error occurred while hashing password' });
          res.render("register", {
            errorMessage: "An error occurred while hashing password",
          });
        });
    })
    .catch((error) => {
      console.error("Error checking existing user:", error);
      // res.status(500).json({ message: 'An error occurred while registering user' });
      res.render("register", {
        errorMessage: "An error occurred while checking existing user",
      });
    });
});

// GET -> Login Page
app.get("/user/login", isAuthenticatedlogin, (req, res) => {
  // res.send("Welcome to the login page")
  res.render("login", { errorMessage: false });
});
// POST ->Login Page
app.post("/user/login", (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // return res.status(404).json({ message: 'User not found' });
        return res.render("login", {
          errorMessage: "User Not Exist.Register first",
        });
      }

      // Compare the provided password with the hashed password in the database
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            // return res.status(401).json({ message: 'Invalid password' });
            return res.render("login", { errorMessage: "Invalid Password" });
          }

          // Generate JWT token
          const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);

          // Set the token as a cookie
          res.cookie("token", token, { httpOnly: true });
          res.status(200).redirect("/note/show");
        })
        .catch((error) => {
          console.error("Error comparing passwords:", error);
          // res.status(500).json({ message: 'An error occurred while comparing passwords' });
          // return res.render('login', { errorMessage: "Internal Server Error" });
          const errorMessage = "Internal Server Error";
          res.render("error_template", { errorMessage });
        });
    })
    .catch((error) => {
      console.error("Error finding user:", error);
      // res.status(500).json({ message: 'An error occurred while finding user' });
      // return res.render('login', { errorMessage: "Internal Server Error" });
      const errorMessage = "Internal Server Error";
      res.render("error_template", { errorMessage });
    });
});

// Logout API endpoint
app.get("/user/logout", (req, res) => {
  // Clear the "token" cookie by providing the cookie name
  res.clearCookie("token");
  // res.json({ message: 'Logout successful' });
  // redirecting to the Home route
  res.redirect("/");
});

// -----------------------------------USER APIS--------------------------------------------

// ----------------------------------Notebook APIS -----------------------------------------

// GET - Show all notes from the DB
app.get("/note/show", isAuthenticated, (req, res) => {
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
});

// GET - ADD the node
app.get("/note/add", (req, res) => {
  // res.send("Enter the tag and description in the modal")
  res.render("addNote");
});

// POST - Add the note in the DB of the current user
app.post("/note/add", isAuthenticated, (req, res) => {
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
      noteMessage = "Note added successfully";
      res.redirect("/note/show");
    })
    .catch((error) => {
      console.error("Error adding note:", error);
      // res.status(500).json({ message: 'An error occurred while adding the note' });
      const errorMessage = "An error occurred while adding the notes";
      res.render("error_template", { errorMessage });
    });
});

// DELETE - Delete a note
app.post("/note/delete/:noteId", isAuthenticated, (req, res) => {
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
});

// PUT - Update a note
app.post("/note/update/:noteId", isAuthenticated, (req, res) => {
  const userId = req.userID; // Assuming the authenticated user ID is available in req.userID
  const noteId = req.params.noteId; // Get the note ID from the request parameters
  const { tag, description } = req.body; // Get the updated tag and description from the request body

  // Find the note by ID and user ID
  Notebook.findOneAndUpdate(
    { _id: noteId, user: userId },
    { tag, description },
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
});

// Search Functionality by the tag name
// searching the the URL using query params
// localhost:3000/note/search?tag=searching
// it returns only the result of array if the tag name is exactly matched with the query
app.get("/note/search", isAuthenticated, (req, res) => {
  const userId = req.userID;
  const { tag } = req.query;

  // Find notes with the specified tag and user ID
  Notebook.find({ tag, user: userId })
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
});

// ----------------------------------Notebook APIS -----------------------------------------

// GET - ROOT API
app.get("/", isAuthenticatedlogin, (req, res) => {
  // res.send('Welcome to the NoteVault');
  res.render("home");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
