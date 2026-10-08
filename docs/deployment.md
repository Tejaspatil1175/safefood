# SafeFood Production Deployment Guide

## Architecture
- Native Node.js clustered instance running via PM2
- Managed MongoDB Atlas database cluster
- REST API exposed on port 4000 (configurable via `PORT`)

## Steps
1. Configure `.env` with `MONGO_URI` pointing to Atlas cluster.
2. Run database seed scripts:
   - `node scripts/seed-rules.js`
   - `node scripts/seed-products.js`
3. Launch clustered instances via PM2:
   - `npm run start:pm2`
4. Set up periodic health check via cron or monitor:
   - `npm run healthcheck`
