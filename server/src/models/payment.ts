// models/payment.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

interface PaymentAttributes {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  period: string;
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: string;
  public clientId!: string;
  public clientName!: string;
  public amount!: number;
  public period!: string;
  public date!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.STRING,
      
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Payment',
  }
);

export default Payment;
