import express from 'express';
import { login, logout, signUp, verifyEmail,forgotPassword,checkAuth, resetPassword } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/check-auth',verifyToken,checkAuth);


router.post('/signup',signUp)
router.post('/login',login);
router.post('/logout',logout);
router.post('/verify-email',verifyEmail);
router.post('/forgotpassword',forgotPassword);
router.post('/reset-password/:token',resetPassword)

export default router;