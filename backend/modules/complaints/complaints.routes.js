import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middlewares/auth.js';
import {
  createComplaintHandler,
  getComplaintHandler,
  listComplaintsHandler,
  exportComplaintPdfHandler,
} from './complaints.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 2 },
});

export const complaintsRouter = Router();

complaintsRouter.use(requireAuth);

complaintsRouter.post('/', upload.array('evidence', 2), createComplaintHandler);
complaintsRouter.get('/', listComplaintsHandler);
complaintsRouter.get('/:id', getComplaintHandler);
complaintsRouter.get('/:id/export', exportComplaintPdfHandler);

export default complaintsRouter;
