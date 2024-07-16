import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface MonthlyTradeSummaryAttributes {
    clientId: string;
    month: string;
    win: number;
    lost: number;
    commission: number;
    swap: number;
    operaciones: number;
    total_netProfit: number;
    win_percentage: number;
    lost_percentage: number;
}

class MonthlyTradeSummary extends Model<MonthlyTradeSummaryAttributes> implements MonthlyTradeSummaryAttributes {
    public clientId!: string;
    public month!: string;
    public win!: number;
    public lost!: number;
    public commission!: number;
    public swap!: number;
    public operaciones!: number;
    public total_netProfit!: number;
    public win_percentage!: number;
    public lost_percentage!: number;
}

MonthlyTradeSummary.init({
    clientId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    month: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    win: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lost: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    commission: {
        type: DataTypes.FLOAT(10, 3),
        allowNull: false,
    },
    swap: {
        type: DataTypes.FLOAT(10, 3),
        allowNull: false,
    },
    operaciones: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_netProfit: {
        type: DataTypes.FLOAT(10, 3),
        allowNull: false,
    },
    win_percentage: {
        type: DataTypes.FLOAT(5, 2),
        allowNull: false,
    },
    lost_percentage: {
        type: DataTypes.FLOAT(5, 2),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'MonthlyTradeSummary',
    timestamps: false,
    tableName: 'monthly_trade_summary',
    underscored: false,
});

export default MonthlyTradeSummary;