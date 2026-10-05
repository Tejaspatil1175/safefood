import { Router } from 'express';
import { uploadScanImages } from '../../middlewares/upload.js';
import { createScan } from './scans.controller.js';

export const scansRouter = Router();

scansRouter.post('/', uploadScanImages, createScan);

export default scansRouter;
