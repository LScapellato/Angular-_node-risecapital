import { Request, Response } from 'express';
import sequelize from '../db/connection';
import { QueryTypes } from 'sequelize';

export const getDailyTradeStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientId = parseInt(req.query.clientId as string, 10);

    if (isNaN(clientId)) {
      res.status(400).json({ error: "Invalid clientId" });
      return;
    }

    await sequelize.query(`SET @cumulative_profitLoss = 0;`);
    await sequelize.query(`SET @cumulative_win = 0;`);
    await sequelize.query(`SET @cumulative_lost = 0;`);

    const results = await sequelize.query(`
      SELECT
          date,
          win,
          lost,
          operaciones,
          total_profitLoss,
          win_percentage,
          lost_percentage,
          @cumulative_profitLoss := @cumulative_profitLoss + total_profitLoss AS cumulative_profitLoss,
          @cumulative_win := @cumulative_win + win AS cumulative_win,
          @cumulative_lost := @cumulative_lost + lost AS cumulative_lost
      FROM (
          SELECT
              DATE(openTime) AS date,
              SUM(CASE WHEN profitLoss > 0 THEN 1 ELSE 0 END) AS win,
              SUM(CASE WHEN profitLoss < 0 THEN 1 ELSE 0 END) AS lost,
              COUNT(*) AS operaciones,
              ROUND(SUM(profitLoss), 3) AS total_profitLoss,
              ROUND(SUM(CASE WHEN profitLoss > 0 THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS win_percentage,
              ROUND(SUM(CASE WHEN profitLoss < 0 THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS lost_percentage
          FROM trades
          WHERE type NOT LIKE 'deposit' AND clientId = :clientId
          GROUP BY DATE(openTime)
          ORDER BY DATE(openTime)
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
