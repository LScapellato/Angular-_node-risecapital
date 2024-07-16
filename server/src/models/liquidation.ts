// models/Liquidation.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from "../db/connection";

import ClientInfo from './clientinfo';

interface LiquidationAttributes {
    id: string;
    clientId: string;
    period: string;
    profitNeto: number;
    setupFee: number;
    performanceFee: number;
    saldoPendiente: number;
    montoPagado: number;
    saldoACobrar: number;
}

class Liquidation extends Model<LiquidationAttributes> implements LiquidationAttributes {
    public id!: string;
    public clientId!: string;
    public period!: string;
    public profitNeto!: number;
    public setupFee!: number;
    public performanceFee!: number;
    public saldoPendiente!: number;
    public montoPagado!: number;
    public saldoACobrar!: number;
}

Liquidation.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    clientId: {
        type: DataTypes.STRING,
       
    },
    period: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profitNeto: DataTypes.FLOAT,
    setupFee: DataTypes.FLOAT,
    performanceFee: DataTypes.FLOAT,
    saldoPendiente: DataTypes.DECIMAL(10,2),
    montoPagado: DataTypes.FLOAT,
    saldoACobrar: DataTypes.DECIMAL(10,2),
}, {
    sequelize,
  modelName: 'Liquidation',
  tableName: 'Liquidations',
});

// Define la relación

export default Liquidation;
