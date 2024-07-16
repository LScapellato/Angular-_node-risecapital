// routes/payment.ts
import { Router } from 'express';
import { registerPayment } from '../controllers/paymentController';

const router = Router();

router.post('/register', registerPayment);

export default router;
