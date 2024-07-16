import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../db/connection";
import  Client  from './client';

// models/Trade.ts


interface TradeAttributes {
    ID: string;
    clientId: string;
    ticket: string;
    openTime: string;
    symbol: string;
    type: string;
    lots: number;
    openPrice: number;
    stopLoss: number;
    takeProfit: number;
    closeTime: string;
    closePrice: number;
    commission: number;
    swap: number;
    profitLoss: number;
    magic: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class Trade extends Model<TradeAttributes> implements TradeAttributes {
    public ID!: string;
    public clientId!: string;
    public ticket!: string;
    public openTime!: string;
    public symbol!: string;
    public type!: string;
    public lots!: number;
    public openPrice!: number;
    public stopLoss!: number;
    public takeProfit!: number;
    public closeTime!: string;
    public closePrice!: number;
    public commission!: number;
    public swap!: number;
    public profitLoss!: number;
    public magic!: number;
    public comment!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Trade.init({
    ID: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    clientId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ticket: DataTypes.STRING,
    openTime: DataTypes.STRING,
    symbol: DataTypes.STRING,
    type: DataTypes.STRING,
    lots: DataTypes.FLOAT,
    openPrice: DataTypes.FLOAT,
    stopLoss: DataTypes.FLOAT,
    takeProfit: DataTypes.FLOAT,
    closeTime: DataTypes.STRING,
    closePrice: DataTypes.FLOAT,
    commission: DataTypes.FLOAT,
    swap: DataTypes.FLOAT,
    profitLoss: DataTypes.FLOAT,
    magic: DataTypes.FLOAT,
    comment: DataTypes.STRING,
}, {
    sequelize,
    modelName: 'Trade',
});

export default Trade;
