"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/upload.ts
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const router = (0, express_1.Router)();
router.post('/', uploadController_1.uploadFile);
router.get('/process-folder', uploadController_1.processFolder);
exports.default = router;
