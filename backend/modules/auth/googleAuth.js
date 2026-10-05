import { OAuth2Client } from 'google-auth-library';
import { env } from '../../config/env.js';
import { UnauthorizedError } from '../../lib/errors.js';

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export async function verifyGoogleIdToken(idToken) {
  if (!idToken) {
    throw new UnauthorizedError('Google ID token is required');
  }

  // Support hermetic test tokens in test environment
  if (env.NODE_ENV === 'test' && idToken.startsWith('mock-google-token')) {
    const email = idToken.includes(':') ? idToken.split(':')[1] : 'user@example.com';
    return {
      googleId: `google-id-${email}`,
      email,
      name: 'Verified Test User',
      avatar: 'https://example.com/avatar.jpg',
    };
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID || undefined,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new UnauthorizedError('Google ID token missing required email claim');
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      avatar: payload.picture || null,
    };
  } catch (err) {
    throw new UnauthorizedError(`Google token verification failed: ${err.message}`);
  }
}

export default {
  verifyGoogleIdToken,
};
