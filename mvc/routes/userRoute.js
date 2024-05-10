import express from 'express'
import { Login, Register, logout } from '../controllers/userController.js';
import { VerifyToken, getUser } from '../../middleware/authentication.js';


const router = express.Router();

router.post('/register',Register);
router.post('/login', Login);
router.get('/user', VerifyToken, getUser);
router.get('/logout', logout);
export default router;