"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Trade extends sequelize_1.Model {
}
Trade.init({
    ID: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    clientId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ticket: sequelize_1.DataTypes.STRING,
    openTime: sequelize_1.DataTypes.STRING,
    symbol: sequelize_1.DataTypes.STRING,
    type: sequelize_1.DataTypes.STRING,
    lots: sequelize_1.DataTypes.FLOAT,
    openPrice: sequelize_1.DataTypes.FLOAT,
    stopLoss: sequelize_1.DataTypes.FLOAT,
    takeProfit: sequelize_1.DataTypes.FLOAT,
    closeTime: sequelize_1.DataTypes.STRING,
    closePrice: sequelize_1.DataTypes.FLOAT,
    commission: sequelize_1.DataTypes.FLOAT,
    swap: sequelize_1.DataTypes.FLOAT,
    profitLoss: sequelize_1.DataTypes.FLOAT,
    magic: sequelize_1.DataTypes.FLOAT,
    comment: sequelize_1.DataTypes.STRING,
}, {
    sequelize: connection_1.default,
    modelName: 'Trade',
});
exports.default = Trade;
