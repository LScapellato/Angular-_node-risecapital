"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/clientinfo.ts
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class ClientInfo extends sequelize_1.Model {
}
ClientInfo.init({
    clientId: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    clientName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    nombreCompleto: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'ClientInfo',
    tableName: 'clientinfo',
    timestamps: false,
    freezeTableName: true, //para indicar que es una vista
});
exports.default = ClientInfo;
