"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const operationControllers_1 = require("../controllers/operationControllers");
const router = (0, express_1.Router)();
router.get('/out-of-term-withdraw', operationControllers_1.getOutOfTermDeposits);
router.get('/deposit-types', operationControllers_1.getDepositTypes);
exports.default = router;
