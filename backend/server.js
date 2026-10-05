import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SafeFood API listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

function gracefulShutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;
