
import { Op } from 'sequelize';
import Trade from '../models/trade'; // Asegúrate de ajustar la ruta según tu estructura de proyecto
import Client  from '../models/client';
import Liquidation from '../models/liquidation'; // Modelo para las liquidaciones, ajusta según tu proyecto
import MonthlyTradeSummary from '../models/monthlytradesummary';




export const calcularLiquidaciones = async (year: number, month: number) => {
    // Convert month to two digits
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const period = `${year}-${monthString}`; // Ajustado para coincidir con el formato de la vista SQL

    console.log(`Calculando liquidaciones para el período: ${period}`);

    // Get the monthly trade summaries for the specified month and year
    const monthlySummaries = await MonthlyTradeSummary.findAll({
        where: {
            month: period
        }
    });

    console.log(`Número de resúmenes mensuales encontrados: ${monthlySummaries.length}`);

    // Get all clients
    const clients = await Client.findAll();
    console.log(`Número de clientes encontrados: ${clients.length}`);

    // Calculate liquidations per client
    const liquidaciones: { [key: string]: any } = {};

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
            await Liquidation.upsert(liquidacion);
            console.log(`Liquidación guardada/actualizada para ${key}`);
        } catch (error) {
            console.error(`Error al guardar/actualizar liquidación para ${key}:`, error);
        }
    }

    return liquidaciones;
};
