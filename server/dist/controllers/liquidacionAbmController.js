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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidationController = void 0;
const liquidation_1 = __importDefault(require("../models/liquidation"));
const clientinfo_1 = __importDefault(require("../models/clientinfo"));
const sequelize_1 = require("sequelize");
class LiquidationController {
    // Get all liquidations
    getAllLiquidations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const liquidations = yield liquidation_1.default.findAll();
                res.status(200).json(liquidations);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching liquidations', error });
            }
        });
    }
    // Get liquidation by ID
    getLiquidationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const liquidation = yield liquidation_1.default.findByPk(id);
                if (liquidation) {
                    res.status(200).json(liquidation);
                }
                else {
                    res.status(404).json({ message: 'Liquidation not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching liquidation', error });
            }
        });
    }
    // Get liquidations by client ID
    getLiquidationsByClientId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientId } = req.params;
                const liquidations = yield liquidation_1.default.findAll({
                    where: { clientId: clientId }
                });
                res.status(200).json(liquidations);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching liquidations for client', error });
            }
        });
    }
    // Get liquidations by period
    getLiquidationsByPeriod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { period } = req.params;
                const liquidations = yield liquidation_1.default.findAll({
                    where: { period: period }
                });
                res.status(200).json(liquidations);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching liquidations for period', error });
            }
        });
    }
    // Create a new liquidation
    createLiquidation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const liquidation = yield liquidation_1.default.create(req.body);
                res.status(201).json(liquidation);
            }
            catch (error) {
                res.status(500).json({ message: 'Error creating liquidation', error });
            }
        });
    }
    // Update a liquidation
    updateLiquidation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [updated] = yield liquidation_1.default.update(req.body, {
                    where: { id: id }
                });
                if (updated) {
                    const updatedLiquidation = yield liquidation_1.default.findByPk(id);
                    res.status(200).json(updatedLiquidation);
                }
                else {
                    res.status(404).json({ message: 'Liquidation not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error updating liquidation', error });
            }
        });
    }
    // Delete a liquidation
    deleteLiquidation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield liquidation_1.default.destroy({
                    where: { id: id }
                });
                if (deleted) {
                    res.status(204).send();
                }
                else {
                    res.status(404).json({ message: 'Liquidation not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting liquidation', error });
            }
        });
    }
    // traer liq por monto y periodo para cargar de pago
    getLiquidationsByAmountAndPeriod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saldoACobrar = parseFloat(req.query.saldoACobrar);
                const period = req.query.period;
                console.log('Received request with parameters:', { saldoACobrar, period });
                if (isNaN(saldoACobrar) || !period) {
                    console.error('Invalid amount or period:', { saldoACobrar, period });
                    res.status(400).json({ message: 'Invalid amount or period' });
                    return;
                }
                console.log('Querying database with:', { saldoACobrar, period });
                const liquidations = yield liquidation_1.default.findAll({
                    where: {
                        saldoACobrar: saldoACobrar,
                        period: period
                    },
                    attributes: ['id', 'clientId', 'period', 'saldoACobrar'],
                    raw: true
                });
                if (liquidations.length === 0) {
                    console.warn('No liquidations found for:', { saldoACobrar, period });
                    res.status(404).json({ message: 'Liquidation not found' });
                    return;
                }
                // Obtener los clientIds de las liquidaciones encontradas
                const clientIds = liquidations.map(liq => liq.clientId);
                // Buscar la información de los clientes en la vista ClientInfo
                const clientInfos = yield clientinfo_1.default.findAll({
                    where: {
                        clientId: {
                            [sequelize_1.Op.in]: clientIds
                        }
                    },
                    attributes: ['clientId', 'nombreCompleto'],
                    raw: true
                });
                // Crear un mapa para un acceso rápido a la información del cliente
                const clientInfoMap = new Map(clientInfos.map(info => [info.clientId, info.nombreCompleto]));
                // Combinar la información de liquidaciones con la información del cliente
                const combinedResults = liquidations.map(liquidation => (Object.assign(Object.assign({}, liquidation), { nombreCompleto: clientInfoMap.get(liquidation.clientId) || null })));
                console.log('Combined results:', combinedResults);
                res.status(200).json(combinedResults);
            }
            catch (error) {
                console.error('Error fetching liquidations by amount and period:', error);
                res.status(500).json({ message: 'Error fetching liquidations by amount and period', error });
            }
        });
    }
}
exports.LiquidationController = LiquidationController;
