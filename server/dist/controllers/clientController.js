"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.getClientById = exports.getClients = void 0;
const client_1 = __importDefault(require("../models/client"));
const getClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield client_1.default.findAll();
        res.json(clients);
    }
    catch (error) {
        console.error('Error al obtener los clientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.getClients = getClients;
const getClientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId } = req.params;
    try {
        const client = yield client_1.default.findOne({ where: { id: clientId } });
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(client);
    }
    catch (error) {
        console.error('Error al obtener el cliente por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.getClientById = getClientById;
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId } = req.params;
    const { name, accountType, accountNumber, tradeFrom, tradeTo } = req.body;
    try {
        let client = yield client_1.default.findOne({ where: { id: clientId } });
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        // Actualizar los campos del cliente
        client.name = name || client.name;
        client.accountType = accountType || client.accountType;
        client.accountNumber = accountNumber || client.accountNumber;
        client.tradeFrom = tradeFrom || client.tradeFrom;
        client.tradeTo = tradeTo || client.tradeTo;
        yield client.save();
        res.json({
            message: `Cliente ${client.name} actualizado correctamente`,
            client
        });
    }
    catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.updateClient = updateClient;
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = req.params.id;
    try {
        const client = yield client_1.default.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        yield client.destroy();
        res.json({ message: 'Cliente eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar el cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.deleteClient = deleteClient;
