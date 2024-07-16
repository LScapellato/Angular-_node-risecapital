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
exports.registerPayment = void 0;
const payment_1 = __importDefault(require("../models/payment"));
const liquidation_1 = __importDefault(require("../models/liquidation"));
const clientinfo_1 = __importDefault(require("../models/clientinfo"));
const registerPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId, amount, period, date } = req.body;
    try {
        // Obtener el nombre del cliente desde ClientInfo
        const client = yield clientinfo_1.default.findOne({ where: { clientId } });
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        // Registrar el pago
        const paymentId = `${clientId}-${period}-${date}`;
        yield payment_1.default.create({
            id: paymentId,
            clientId,
            clientName: client.nombreCompleto,
            amount,
            period,
            date
        });
        // Actualizar la liquidación
        const liquidation = yield liquidation_1.default.findOne({ where: { clientId, period } });
        if (liquidation) {
            liquidation.montoPagado += amount;
            liquidation.saldoPendiente = liquidation.montoPagado - liquidation.saldoACobrar;
            yield liquidation.save();
        }
        res.status(201).json({ message: 'Pago registrado correctamente' });
    }
    catch (error) {
        console.error('Error registrando el pago:', error);
        res.status(500).json({ message: 'Error registrando el pago' });
    }
});
exports.registerPayment = registerPayment;
