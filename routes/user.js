import express from 'express';
import { register, login, logout,verify } from '../controllers/user.js';
import  { RegisterSchema, LoginSchema } from '../validation/zodschema.js'
import {validate}  from '../validation/validation.schema.js'
const router = express.Router();

// POST -Registering User in the database
router.post("/user/register",validate(RegisterSchema), register);
// POST -VerifyOTP
router.post("/user/verify-otp", verify);
// POST ->Login Page
router.post("/user/login",validate(LoginSchema), login);
// Logout API endpoint
router.get("/user/logout", logout);

export default router;