"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/client.ts
// Importa los tipos necesarios de Sequelize
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
// Modelo extendido con el tipo Model y la interfaz ClientAttributes
class Client extends sequelize_1.Model {
}
// Inicializa el modelo con los campos y la instancia de Sequelize
Client.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    accountType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    accountNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    tradeFrom: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    tradeTo: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Client', // Nombre del modelo en singular (opcional)
});
exports.default = Client;
