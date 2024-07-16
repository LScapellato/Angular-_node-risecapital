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
exports.getDepositTypes = exports.getOutOfTermDeposits = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const sequelize_1 = require("sequelize");
const getOutOfTermDeposits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield connection_1.default.query(`
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
    `, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getOutOfTermDeposits = getOutOfTermDeposits;
const getDepositTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = parseInt(req.query.clientId, 10);
        if (isNaN(clientId)) {
            res.status(400).json({ error: "Invalid clientId" });
            return;
        }
        const results = yield connection_1.default.query(`
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
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getDepositTypes = getDepositTypes;
