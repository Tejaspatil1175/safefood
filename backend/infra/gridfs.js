import mongoose from 'mongoose';
import { Readable } from 'stream';
import { logger } from '../lib/logger.js';

let bucket = null;

export function getGridFSBucket() {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    if (!bucket || bucket.s.db !== mongoose.connection.db) {
      bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'evidence',
      });
    }
    return bucket;
  }
  return null;
}

export async function uploadEvidenceBuffer(
  buffer,
  filename = 'evidence.jpg',
  { contentType = 'image/jpeg', metadata = {} } = {},
) {
  const fsBucket = getGridFSBucket();
  if (!fsBucket) {
    throw new Error('GridFS bucket is unavailable: MongoDB is not connected');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = fsBucket.openUploadStream(filename, {
      contentType,
      metadata,
    });

    const readable = Readable.from(buffer);
    readable
      .pipe(uploadStream)
      .on('error', (err) => {
        logger.error({ err: err.message }, 'Failed to upload evidence file to GridFS');
        reject(err);
      })
      .on('finish', () => {
        resolve(uploadStream.id);
      });
  });
}

export async function downloadEvidenceBuffer(fileId) {
  const fsBucket = getGridFSBucket();
  if (!fsBucket) {
    throw new Error('GridFS bucket is unavailable: MongoDB is not connected');
  }

  const objectId = typeof fileId === 'string' ? new mongoose.Types.ObjectId(fileId) : fileId;

  return new Promise((resolve, reject) => {
    const downloadStream = fsBucket.openDownloadStream(objectId);
    const chunks = [];

    downloadStream.on('data', (chunk) => chunks.push(chunk));
    downloadStream.on('error', reject);
    downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export async function deleteEvidence(fileId) {
  const fsBucket = getGridFSBucket();
  if (!fsBucket) {
    throw new Error('GridFS bucket is unavailable: MongoDB is not connected');
  }

  const objectId = typeof fileId === 'string' ? new mongoose.Types.ObjectId(fileId) : fileId;
  await fsBucket.delete(objectId);
}

export default {
  getGridFSBucket,
  uploadEvidenceBuffer,
  downloadEvidenceBuffer,
  deleteEvidence,
};
