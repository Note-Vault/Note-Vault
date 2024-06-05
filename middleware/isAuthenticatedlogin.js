import jwt from "jsonwebtoken";
import User from "../model/User.js";

const isAuthenticatedlogin = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    // Verify and decode the token
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
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
          req.userEMAIL=curr_user.email;
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

export default isAuthenticatedlogin;
