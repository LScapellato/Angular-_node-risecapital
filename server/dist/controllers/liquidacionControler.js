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
exports.calcularLiquidaciones = void 0;
const client_1 = __importDefault(require("../models/client"));
const liquidation_1 = __importDefault(require("../models/liquidation")); // Modelo para las liquidaciones, ajusta según tu proyecto
const monthlytradesummary_1 = __importDefault(require("../models/monthlytradesummary"));
const calcularLiquidaciones = (year, month) => __awaiter(void 0, void 0, void 0, function* () {
    // Convert month to two digits
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const period = `${year}-${monthString}`; // Ajustado para coincidir con el formato de la vista SQL
    console.log(`Calculando liquidaciones para el período: ${period}`);
    // Get the monthly trade summaries for the specified month and year
    const monthlySummaries = yield monthlytradesummary_1.default.findAll({
        where: {
            month: period
        }
    });
    console.log(`Número de resúmenes mensuales encontrados: ${monthlySummaries.length}`);
    // Get all clients
    const clients = yield client_1.default.findAll();
    console.log(`Número de clientes encontrados: ${clients.length}`);
    // Calculate liquidations per client
    const liquidaciones = {};
    monthlySummaries.forEach((summary) => {
        const clientId = summary.clientId;
        const profitNeto = summary.total_netProfit;
        const key = `${period}-${clientId}`; // Composite key
        console.log(`Procesando resumen para cliente ${clientId}: Profit neto = ${profitNeto}`);
        liquidaciones[key] = {
            id: key,
            clientId: clientId,
            period: period,
            profitNeto: profitNeto,
            setupFee: 20,
            performanceFee: 0,
            saldoPendiente: 0,
            montoPagado: 0,
            saldoACobrar: 0
        };
    });
    console.log(`Número de liquidaciones calculadas: ${Object.keys(liquidaciones).length}`);
    for (const key in liquidaciones) {
        const liquidacion = liquidaciones[key];
        const profitNeto = liquidacion.profitNeto;
        const performanceFee = profitNeto * 0.15;
        liquidacion.performanceFee = parseFloat(performanceFee.toFixed(2));
        liquidacion.saldoACobrar = parseFloat((liquidacion.setupFee + performanceFee).toFixed(2));
        liquidacion.saldoPendiente = parseFloat((liquidacion.setupFee + performanceFee).toFixed(2));
        console.log(`Liquidación final para ${key}: Profit neto = ${profitNeto}, Performance Fee = ${performanceFee}, Saldo a cobrar = ${liquidacion.saldoACobrar}`);
        // Create or update the liquidation in the database
        try {
            yield liquidation_1.default.upsert(liquidacion);
            console.log(`Liquidación guardada/actualizada para ${key}`);
        }
        catch (error) {
            console.error(`Error al guardar/actualizar liquidación para ${key}:`, error);
        }
    }
    return liquidaciones;
});
exports.calcularLiquidaciones = calcularLiquidaciones;
