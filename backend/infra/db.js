import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

let isConnecting = false;

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

export function getDbState() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
}

export async function connectDB({
  uri = env.MONGO_URI,
  maxRetries = 5,
  retryDelayMs = 2000,
} = {}) {
  if (isDbConnected()) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return;
  }

  isConnecting = true;

  mongoose.connection.on('connected', () => {
    logger.info({ uri: uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') }, 'MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    logger.error({ err: err.message }, 'MongoDB connection error');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      attempt += 1;
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnecting = false;
      return mongoose.connection;
    } catch (err) {
      logger.error(
        { attempt, maxRetries, err: err.message },
        `MongoDB connection attempt ${attempt} failed`,
      );
      if (attempt >= maxRetries) {
        isConnecting = false;
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs * attempt));
    }
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    logger.info('Disconnecting MongoDB...');
    await mongoose.disconnect();
    logger.info('MongoDB disconnected cleanly');
  }
}

export default {
  connectDB,
  disconnectDB,
  isDbConnected,
  getDbState,
};
