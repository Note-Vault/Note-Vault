import express from 'express';
import { showForgotPasswordForm, sendResetLink, showResetPasswordForm, resetPassword } from '../controllers/password.js';

const router = express.Router();

// Show the form to input the email for password reset
router.get('/forgot-password', showForgotPasswordForm);

// Handle form submission and send reset link
router.post('/forgot-password', sendResetLink);

// Show the form to reset the password
router.get('/reset-password/:token', showResetPasswordForm);

// Handle the actual password reset
router.post('/reset-password/:token', resetPassword);

export default router;
