import { Request, Response } from 'express';
import sequelize from '../db/connection';
import { QueryTypes } from 'sequelize';

export const getOutOfTermDeposits = async (req: Request, res: Response): Promise<void> => {
  try {
    const results = await sequelize.query(
      `
      SELECT
  ci.nombreCompleto,
  t.ID AS operationId,
  t.profitLoss AS operationAmount,
  CONVERT_TZ(t.openTime, '+00:00', '-03:00') AS operationTime,
  COUNT(t.ID) OVER (PARTITION BY ci.nombreCompleto) AS numDeposits,
  SUM(t.profitLoss) OVER (PARTITION BY ci.nombreCompleto) AS totalAmount
  FROM
  trades t
  JOIN
  ClientInfo ci ON t.clientId = ci.clientId
  WHERE
  t.type = 'deposit'
  AND t.profitLoss < 0
  AND HOUR(CONVERT_TZ(t.openTime, '+00:00', '-03:00')) >= 17
  AND DAY(t.openTime) > 10
  ORDER BY
  ci.nombreCompleto, t.openTime;
    `,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getDepositTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientId = parseInt(req.query.clientId as string, 10);

    if (isNaN(clientId)) {
      res.status(400).json({ error: "Invalid clientId" });
      return;
    }

    const results = await sequelize.query(`
SELECT 
    ci.clientId AS id_cliente,
    ci.nombreCompleto AS nombre_cliente,
    CONVERT_TZ(t.openTime, '+00:00', '-03:00') AS fecha_operacion,
    CASE
        WHEN t.profitLoss > 0 THEN 'Depósito'
        WHEN t.profitLoss < 0 THEN 'Retiro'
        ELSE 'Otro'
    END AS tipo_operacion,
    ABS(t.profitLoss) AS monto
FROM 
    trades t
JOIN 
    ClientInfo ci ON t.clientId = ci.clientId
WHERE 
    t.type = 'deposit'
    AND t.clientId = :clientId
ORDER BY 
    t.openTime DESC;
    `, {
      replacements: { clientId },
      type: QueryTypes.SELECT
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

