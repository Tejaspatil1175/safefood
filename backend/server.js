import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { connectDB, disconnectDB } from './infra/db.js';

const app = createApp();

let server;

async function start() {
  try {
    // Attempt DB connection
    await connectDB();
  } catch (err) {
    logger.error({ err: err.message }, 'Failed to connect to database on startup');
  }

  server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, `SafeFood API listening on port ${env.PORT}`);
  });
}

async function gracefulShutdown(signal) {
  logger.info({ signal }, `Received ${signal}. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }

  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

start();

export default server;
