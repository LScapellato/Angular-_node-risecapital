// src/routes/upload.ts
import { Router } from 'express';
import { processFolder, uploadFile } from '../controllers/uploadController';

const router = Router();

router.post('/', uploadFile);
router.get('/process-folder', processFolder);

export default router;



