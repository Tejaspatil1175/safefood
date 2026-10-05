import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGO_URI: z.string().default('mongodb://localhost:27017/safefood'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  JWT_ACCESS_SECRET: z.string().default('default-dev-jwt-access-secret-key-32chars'),
  JWT_REFRESH_SECRET: z.string().default('default-dev-jwt-refresh-secret-key-32chars'),
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(8),
});

export function parseEnv(source = process.env) {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const errorDetails = result.error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    throw new Error(`Invalid environment configuration: ${errorDetails}`);
  }
  return result.data;
}

export const env = parseEnv();
export default env;
