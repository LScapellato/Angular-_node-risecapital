import { Router } from 'express';
import { getOutOfTermDeposits, getDepositTypes } from '../controllers/operationControllers';

const router = Router();

router.get('/out-of-term-withdraw', getOutOfTermDeposits);
router.get('/deposit-types', getDepositTypes);

export default router;
