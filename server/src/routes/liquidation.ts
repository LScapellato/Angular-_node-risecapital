import { Router, Request, Response } from 'express';
import { calcularLiquidaciones } from '../controllers/liquidacionControler'; // Ajusta la ruta según tu estructura de proyecto
import { LiquidationController} from '../controllers/liquidacionAbmController'
const router = Router();
const liquidationController = new LiquidationController();

router.get('/liquidacion/:year/:month', async (req: Request, res: Response) => {
    const { year, month } = req.params;

    try {
        const liquidaciones = await calcularLiquidaciones(parseInt(year), parseInt(month));
        res.json({ liquidaciones });
    } catch (error) {
        console.error('Error al calcular las liquidaciones:', error);
        res.status(500).json({ error: 'Error al calcular las liquidaciones' });
    }
});

router.get('/liquidations', liquidationController.getAllLiquidations);
router.get('/liquidations/:id', liquidationController.getLiquidationById);
router.get('/liquidations/client/:clientId', liquidationController.getLiquidationsByClientId);
router.get('/liquidations/period/:period', liquidationController.getLiquidationsByPeriod);
router.post('/liquidations', liquidationController.createLiquidation);
router.put('/liquidations/:id', liquidationController.updateLiquidation);
router.delete('/liquidations/:id', liquidationController.deleteLiquidation);
router.get('/liqui/search', liquidationController.getLiquidationsByAmountAndPeriod);


export default router;
