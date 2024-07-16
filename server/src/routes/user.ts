import {Router } from 'express';
import { loginUser, newUser } from '../controllers/userControllers';

const router = Router();
router.post('/register', newUser);
router.post('/login', loginUser)

export default router;