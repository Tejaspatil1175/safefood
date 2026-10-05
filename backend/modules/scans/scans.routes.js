import { Router } from 'express';
import { uploadScanImages } from '../../middlewares/upload.js';
import { createScan, getScan, getScansList } from './scans.controller.js';

export const scansRouter = Router();

scansRouter.post('/', uploadScanImages, createScan);
scansRouter.get('/', getScansList);
scansRouter.get('/:id', getScan);

export default scansRouter;
