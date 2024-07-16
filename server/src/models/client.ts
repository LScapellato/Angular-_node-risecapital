// src/models/client.ts
// Importa los tipos necesarios de Sequelize
import { DataTypes, Model } from 'sequelize';
import sequelize from "../db/connection";

// Define la interfaz para el modelo Client
interface ClientAttributes {
    id: string;
    name?: string | null;
    accountType?: string | null;
    accountNumber?: string | null;
    tradeFrom?: Date | null;
    tradeTo?: Date | null;
}

// Modelo extendido con el tipo Model y la interfaz ClientAttributes
class Client extends Model<ClientAttributes> implements ClientAttributes {
    public id!: string;
    public name!: string | null;
    public accountType!: string | null;
    public accountNumber!: string | null;
    public tradeFrom!: Date | null;
    public tradeTo!: Date | null;
}

// Inicializa el modelo con los campos y la instancia de Sequelize
Client.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    accountType: {
        type: DataTypes.STRING,
        allowNull: true,
        
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tradeFrom: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    tradeTo: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize, // Instancia de Sequelize
    modelName: 'Client', // Nombre del modelo en singular (opcional)
});

export default Client;
