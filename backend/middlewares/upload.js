import multer from 'multer';
import { ValidationError } from '../lib/errors.js';

export const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`Unsupported file type: ${file.mimetype}. Allowed types: image/jpeg, image/png, image/webp.`));
  }
}

const multerUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 2,
  },
  fileFilter,
}).fields([
  { name: 'images', maxCount: 2 },
  { name: 'label', maxCount: 2 },
  { name: 'image', maxCount: 2 },
  { name: 'file', maxCount: 2 },
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 },
]);

export function uploadScanImages(req, res, next) {
  multerUpload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ValidationError(`File size exceeds limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`));
        }
        if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new ValidationError('Maximum 2 images allowed (front and back).'));
        }
        return next(new ValidationError(err.message));
      }
      return next(err);
    }

    const files = [];
    if (req.files) {
      if (Array.isArray(req.files.images)) {
        files.push(...req.files.images);
      }
      if (Array.isArray(req.files.label)) {
        files.push(...req.files.label);
      }
      if (Array.isArray(req.files.image)) {
        files.push(...req.files.image);
      }
      if (Array.isArray(req.files.file)) {
        files.push(...req.files.file);
      }
      if (Array.isArray(req.files.front)) {
        files.push(...req.files.front);
      }
      if (Array.isArray(req.files.back)) {
        files.push(...req.files.back);
      }
    }

    if (files.length === 0) {
      return next(new ValidationError('At least one image is required (front and/or back).'));
    }

    if (files.length > 2) {
      return next(new ValidationError('Maximum 2 images allowed (front and back).'));
    }

    req.scanImages = files;
    next();
  });
}

export default uploadScanImages;
