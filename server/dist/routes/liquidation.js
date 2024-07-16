"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const liquidacionControler_1 = require("../controllers/liquidacionControler"); // Ajusta la ruta según tu estructura de proyecto
const liquidacionAbmController_1 = require("../controllers/liquidacionAbmController");
const router = (0, express_1.Router)();
const liquidationController = new liquidacionAbmController_1.LiquidationController();
router.get('/liquidacion/:year/:month', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { year, month } = req.params;
    try {
        const liquidaciones = yield (0, liquidacionControler_1.calcularLiquidaciones)(parseInt(year), parseInt(month));
        res.json({ liquidaciones });
    }
    catch (error) {
        console.error('Error al calcular las liquidaciones:', error);
        res.status(500).json({ error: 'Error al calcular las liquidaciones' });
    }
}));
router.get('/liquidations', liquidationController.getAllLiquidations);
router.get('/liquidations/:id', liquidationController.getLiquidationById);
router.get('/liquidations/client/:clientId', liquidationController.getLiquidationsByClientId);
router.get('/liquidations/period/:period', liquidationController.getLiquidationsByPeriod);
router.post('/liquidations', liquidationController.createLiquidation);
router.put('/liquidations/:id', liquidationController.updateLiquidation);
router.delete('/liquidations/:id', liquidationController.deleteLiquidation);
router.get('/liqui/search', liquidationController.getLiquidationsByAmountAndPeriod);
exports.default = router;
