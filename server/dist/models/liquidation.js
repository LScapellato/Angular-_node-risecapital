"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Liquidation.ts
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Liquidation extends sequelize_1.Model {
}
Liquidation.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    clientId: {
        type: sequelize_1.DataTypes.STRING,
    },
    period: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    profitNeto: sequelize_1.DataTypes.FLOAT,
    setupFee: sequelize_1.DataTypes.FLOAT,
    performanceFee: sequelize_1.DataTypes.FLOAT,
    saldoPendiente: sequelize_1.DataTypes.DECIMAL(10, 2),
    montoPagado: sequelize_1.DataTypes.FLOAT,
    saldoACobrar: sequelize_1.DataTypes.DECIMAL(10, 2),
}, {
    sequelize: connection_1.default,
    modelName: 'Liquidation',
    tableName: 'Liquidations',
});
// Define la relación
exports.default = Liquidation;
