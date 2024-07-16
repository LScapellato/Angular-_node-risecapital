import { Request, Response } from 'express';
import sequelize from '../db/connection';
import { QueryTypes } from 'sequelize';

export const getTradeStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientId = parseInt(req.query.clientId as string, 10);

    if (isNaN(clientId)) {
      res.status(400).json({ error: "Invalid clientId" });
      return;
    }

    await sequelize.query(`SET @cumulative_netProfit = 0;`);
    await sequelize.query(`SET @cumulative_win = 0;`);
    await sequelize.query(`SET @cumulative_lost = 0;`);
    await sequelize.query(`SET @cumulative_comission = 0;`);
    await sequelize.query(`SET @cumulative_swap = 0;`);

    const results = await sequelize.query(`
SELECT
    month,
    win,
    lost,
    operaciones,
    commission,
    swap,
    total_netProfit,
    win_percentage,
    lost_percentage,
   ROUND(@cumulative_netProfit := @cumulative_netProfit + total_netProfit, 2) AS cumulative_netProfit,
    @cumulative_win := @cumulative_win + win AS cumulative_win,
    @cumulative_lost := @cumulative_lost + lost AS cumulative_lost,
    @cumulative_comission := @cumulative_comission + commission AS cumulative_comission,
    @cumulative_swap := @cumulative_swap + swap AS cumulative_swap
FROM (
    SELECT
        DATE_FORMAT(openTime, '%Y-%m') AS month,
        SUM(CASE WHEN (Commission + Swap + profitLoss) > 0 THEN 1 ELSE 0 END) AS win,
        SUM(CASE WHEN (Commission + Swap + profitLoss) < 0 THEN 1 ELSE 0 END) AS lost,
        ROUND(SUM(Commission), 3) AS commission,
        ROUND(SUM(Swap), 3) AS swap,
        COUNT(*) AS operaciones,
        ROUND(SUM(Commission + Swap + profitLoss), 3) AS total_netProfit,
        ROUND(SUM(CASE WHEN (Commission + Swap + profitLoss) > 0 THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS win_percentage,
        ROUND(SUM(CASE WHEN (Commission + Swap + profitLoss) < 0 THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS lost_percentage
    FROM trades
    WHERE type NOT LIKE 'deposit' AND clientId = :clientId
    GROUP BY month
    ORDER BY month
) AS subquery;
    `, {
      replacements: { clientId },
      type: QueryTypes.SELECT
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllTradesForClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientId = parseInt(req.query.clientId as string, 10);

    if (isNaN(clientId)) {
      res.status(400).json({ error: "Invalid clientId" });
      return;
    }

    const trades = await sequelize.query(`
      SELECT *,
             (Commission + Swap + profitLoss) AS netProfit
      FROM trades
      WHERE clientId = :clientId
      ORDER BY openTime;
    `, {
      replacements: { clientId },
      type: QueryTypes.SELECT
    });

    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

