"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/payment.ts
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
router.post('/register', paymentController_1.registerPayment);
exports.default = router;
