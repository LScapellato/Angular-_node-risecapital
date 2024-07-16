import {Router} from 'express';
import { deleteClient, getClientById, getClients, updateClient } from '../controllers/clientController';

const router = Router();
router.get('/', getClients);
router.get('/:clientId', getClientById);
router.put('/:clientId' ,updateClient);
router.delete('/:clientId', deleteClient);

export default router;