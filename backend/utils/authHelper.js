const crypto = require('crypto');

/**
 * Hash password securely using Node.js built-in scrypt cryptographic function
 */
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

/**
 * Verify password against stored salt and scrypt hash
 */
const comparePassword = (password, storedHash) => {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, key] = storedHash.split(':');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(hash, 'hex'));
};

/**
 * Generate standard HMAC-SHA256 JWT Token
 */
const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'restaurant_secret_key_2026';
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  
  // Set expiration to 7 days
  const exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
};

/**
 * Verify and decode JWT Token
 */
const verifyToken = (token) => {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, bodyB64, signature] = parts;
    const secret = process.env.JWT_SECRET || 'restaurant_secret_key_2026';

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${headerB64}.${bodyB64}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(bodyB64, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch (error) {
    return null;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken
};

