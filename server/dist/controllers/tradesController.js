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
exports.getAllTradesForClient = exports.getTradeStats = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const sequelize_1 = require("sequelize");
const getTradeStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = parseInt(req.query.clientId, 10);
        if (isNaN(clientId)) {
            res.status(400).json({ error: "Invalid clientId" });
            return;
        }
        yield connection_1.default.query(`SET @cumulative_netProfit = 0;`);
        yield connection_1.default.query(`SET @cumulative_win = 0;`);
        yield connection_1.default.query(`SET @cumulative_lost = 0;`);
        yield connection_1.default.query(`SET @cumulative_comission = 0;`);
        yield connection_1.default.query(`SET @cumulative_swap = 0;`);
        const results = yield connection_1.default.query(`
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
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getTradeStats = getTradeStats;
const getAllTradesForClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = parseInt(req.query.clientId, 10);
        if (isNaN(clientId)) {
            res.status(400).json({ error: "Invalid clientId" });
            return;
        }
        const trades = yield connection_1.default.query(`
      SELECT *,
             (Commission + Swap + profitLoss) AS netProfit
      FROM trades
      WHERE clientId = :clientId
      ORDER BY openTime;
    `, {
            replacements: { clientId },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json(trades);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllTradesForClient = getAllTradesForClient;
