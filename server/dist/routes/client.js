"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientController_1 = require("../controllers/clientController");
const router = (0, express_1.Router)();
router.get('/', clientController_1.getClients);
router.get('/:clientId', clientController_1.getClientById);
router.put('/:clientId', clientController_1.updateClient);
router.delete('/:clientId', clientController_1.deleteClient);
exports.default = router;
