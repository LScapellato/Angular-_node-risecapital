import {Request, Response} from 'express';
import Client from '../models/client';





export const getClients = async (req: Request, res: Response) => {
    try {
        const clients = await Client.findAll();
        res.json(clients);
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getClientById = async (req: Request, res: Response) => {
    const{ clientId } = req.params ;
    
    try {
        const client = await Client.findOne ({ where: { id: clientId } });
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(client);
    } catch (error) {
        console.error('Error al obtener el cliente por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const updateClient = async (req: Request, res: Response) => {
    const { clientId } = req.params
    const { name, accountType, accountNumber, tradeFrom, tradeTo } = req.body;
    try {
        let client = await Client.findOne({where: { id: clientId}});
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        // Actualizar los campos del cliente
        client.name = name || client.name;
        client.accountType = accountType || client.accountType;
        client.accountNumber = accountNumber || client.accountNumber;
        client.tradeFrom = tradeFrom || client.tradeFrom;
        client.tradeTo = tradeTo || client.tradeTo;
        await client.save();
        res.json({
            message: `Cliente ${client.name} actualizado correctamente`,
            client
        });
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    const clientId = req.params.id;
    try {
        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        await client.destroy();
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};