import { Request, Response } from 'express';
import Liquidation from '../models/liquidation';

import ClientInfo from '../models/clientinfo';
import { Op } from 'sequelize';

export class LiquidationController {
  // Get all liquidations
  public async getAllLiquidations(req: Request, res: Response): Promise<void> {
    try {
      const liquidations = await Liquidation.findAll();
      res.status(200).json(liquidations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching liquidations', error });
    }
  }

  // Get liquidation by ID
  public async getLiquidationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const liquidation = await Liquidation.findByPk(id);
      if (liquidation) {
        res.status(200).json(liquidation);
      } else {
        res.status(404).json({ message: 'Liquidation not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching liquidation', error });
    }
  }

  // Get liquidations by client ID
  public async getLiquidationsByClientId(req: Request, res: Response): Promise<void> {
    try {
      const { clientId } = req.params;
      const liquidations = await Liquidation.findAll({
        where: { clientId: clientId }
      });
      res.status(200).json(liquidations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching liquidations for client', error });
    }
  }

  // Get liquidations by period
  public async getLiquidationsByPeriod(req: Request, res: Response): Promise<void> {
    try {
      const { period } = req.params;
      const liquidations = await Liquidation.findAll({
        where: { period: period }
      });
      res.status(200).json(liquidations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching liquidations for period', error });
    }
  }

  // Create a new liquidation
  public async createLiquidation(req: Request, res: Response): Promise<void> {
    try {
      const liquidation = await Liquidation.create(req.body);
      res.status(201).json(liquidation);
    } catch (error) {
      res.status(500).json({ message: 'Error creating liquidation', error });
    }
  }

  // Update a liquidation
  public async updateLiquidation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [updated] = await Liquidation.update(req.body, {
        where: { id: id }
      });
      if (updated) {
        const updatedLiquidation = await Liquidation.findByPk(id);
        res.status(200).json(updatedLiquidation);
      } else {
        res.status(404).json({ message: 'Liquidation not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating liquidation', error });
    }
  }

  // Delete a liquidation
  public async deleteLiquidation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Liquidation.destroy({
        where: { id: id }
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Liquidation not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting liquidation', error });
    }
  }

  // traer liq por monto y periodo para cargar de pago
  public async getLiquidationsByAmountAndPeriod(req: Request, res: Response): Promise<void> {
    try {
      const saldoACobrar = parseFloat(req.query.saldoACobrar as string);
      const period = req.query.period as string;

      console.log('Received request with parameters:', { saldoACobrar, period });

      if (isNaN(saldoACobrar) || !period) {
        console.error('Invalid amount or period:', { saldoACobrar, period });
        res.status(400).json({ message: 'Invalid amount or period' });
        return;
      }

      console.log('Querying database with:', { saldoACobrar, period });
      const liquidations = await Liquidation.findAll({
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
      const clientInfos = await ClientInfo.findAll({
        where: {
          clientId: {
            [Op.in]: clientIds
          }
        },
        attributes: ['clientId', 'nombreCompleto'],
        raw: true
      });

      // Crear un mapa para un acceso rápido a la información del cliente
      const clientInfoMap = new Map(clientInfos.map(info => [info.clientId, info.nombreCompleto]));

      // Combinar la información de liquidaciones con la información del cliente
      const combinedResults = liquidations.map(liquidation => ({
        ...liquidation,
        nombreCompleto: clientInfoMap.get(liquidation.clientId) || null
      }));

      console.log('Combined results:', combinedResults);
      res.status(200).json(combinedResults);
    } catch (error) {
      console.error('Error fetching liquidations by amount and period:', error);
      res.status(500).json({ message: 'Error fetching liquidations by amount and period', error });
    }
  }
}