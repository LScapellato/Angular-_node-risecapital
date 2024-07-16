// controllers/paymentController.ts
import { Request, Response } from 'express';
import Payment from '../models/payment';
import Liquidation from '../models/liquidation';
import ClientInfo from '../models/clientinfo';

export const registerPayment = async (req: Request, res: Response) => {
  const { clientId, amount, period, date } = req.body;
  try {
    // Obtener el nombre del cliente desde ClientInfo
    const client = await ClientInfo.findOne({ where: { clientId } });

    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Registrar el pago
    const paymentId = `${clientId}-${period}-${date}`;
    await Payment.create({
      id: paymentId,
      clientId,
      clientName: client.nombreCompleto,
      amount,
      period,
      date
    });

    // Actualizar la liquidación
    const liquidation = await Liquidation.findOne({ where: { clientId, period } });
    if (liquidation) {
      liquidation.montoPagado += amount;
      liquidation.saldoPendiente =  liquidation.montoPagado - liquidation.saldoACobrar;
      await liquidation.save();
    }

    res.status(201).json({ message: 'Pago registrado correctamente' });
  } catch (error) {
    console.error('Error registrando el pago:', error);
    res.status(500).json({ message: 'Error registrando el pago' });
  }
};
