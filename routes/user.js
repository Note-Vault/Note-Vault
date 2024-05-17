import express from 'express';
import { register, login, logout } from '../controllers/user.js';

const router = express.Router();

// POST -Registering User in the database
router.post("/user/register", register);
// POST ->Login Page
router.post("/user/login", login);
// Logout API endpoint
router.get("/user/logout", logout);

export default router;