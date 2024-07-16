import { Router } from 'express';
import { getAllTradesForClient, getTradeStats } from '../controllers/tradesController';
import { getDailyTradeStats } from '../controllers/tradesdailyController';

const router = Router();

router.get('/trades/stats', getTradeStats);
router.get('/all-trades', getAllTradesForClient);
router.get('/daily-trade-stats', getDailyTradeStats);


export default router;
