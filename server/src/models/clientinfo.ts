// models/clientinfo.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';
import Liquidation from './liquidation';

class ClientInfo extends Model {
  public clientId!: string;
  public clientName!: string;
  public nombreCompleto!: string;
}

ClientInfo.init(
  {
    clientId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    nombreCompleto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },
  {
    sequelize,
    modelName: 'ClientInfo',
    tableName: 'clientinfo',
    timestamps: false,
    freezeTableName: true, //para indicar que es una vista
  }
);

export default ClientInfo;
