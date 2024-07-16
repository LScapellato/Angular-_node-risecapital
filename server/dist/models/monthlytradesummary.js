"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class MonthlyTradeSummary extends sequelize_1.Model {
}
MonthlyTradeSummary.init({
    clientId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    month: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    win: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    lost: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    commission: {
        type: sequelize_1.DataTypes.FLOAT(10, 3),
        allowNull: false,
    },
    swap: {
        type: sequelize_1.DataTypes.FLOAT(10, 3),
        allowNull: false,
    },
    operaciones: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    total_netProfit: {
        type: sequelize_1.DataTypes.FLOAT(10, 3),
        allowNull: false,
    },
    win_percentage: {
        type: sequelize_1.DataTypes.FLOAT(5, 2),
        allowNull: false,
    },
    lost_percentage: {
        type: sequelize_1.DataTypes.FLOAT(5, 2),
        allowNull: false,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'MonthlyTradeSummary',
    timestamps: false,
    tableName: 'monthly_trade_summary',
    underscored: false,
});
exports.default = MonthlyTradeSummary;
