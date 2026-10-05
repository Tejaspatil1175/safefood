import { Router } from 'express';
import { uploadScanImages } from '../../middlewares/upload.js';
import { optionalAuth } from '../../middlewares/auth.js';
import { createScan, getScan, getScansList } from './scans.controller.js';

export const scansRouter = Router();

scansRouter.post('/', optionalAuth, uploadScanImages, createScan);
scansRouter.get('/', optionalAuth, getScansList);
scansRouter.get('/:id', optionalAuth, getScan);

export default scansRouter;
