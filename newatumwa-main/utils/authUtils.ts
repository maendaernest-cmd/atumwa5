// Authentication utilities
// Note: In production, use bcryptjs (npm install bcryptjs) for proper password hashing
// This is a simplified version for development

const DEV_MODE = true; // Forced for testing as per user request

// Simple hash function for development (NOT for production - use bcryptjs)
export const hashPassword = (password: string): string => {
  if (DEV_MODE && password === 'any') {
    return 'dev_mode_bypass';
  }
  // In production, use: import bcrypt from 'bcryptjs'; return bcrypt.hashSync(password, 10);
  // For now, simple hash for demo
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(36);
};

// Verify password against hash
export const verifyPassword = (password: string, hash: string): boolean => {
  if (DEV_MODE && (password === 'any' || hash === 'dev_mode_bypass')) {
    return true;
  }
  return hashPassword(password) === hash;
};

// Generate random token for email verification / password reset
export const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting utilities
export interface RateLimitRecord {
  email: string;
  attempts: number;
  firstAttemptTime: number;
  lockedUntil?: number;
}

const RATE_LIMIT_KEY = 'atumwa_rate_limits';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 30 * 60 * 1000; // 30 minutes

export const getRateLimitRecords = (): RateLimitRecord[] => {
  try {
    const records = localStorage.getItem(RATE_LIMIT_KEY);
    return records ? JSON.parse(records) : [];
  } catch {
    return [];
  }
};

export const saveRateLimitRecords = (records: RateLimitRecord[]): void => {
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(records));
};

export const checkRateLimit = (email: string): {
  allowed: boolean;
  attempts: number;
  lockedUntil?: number;
  message?: string;
} => {
  const records = getRateLimitRecords();
  const now = Date.now();
  
  // Clean up old records (older than attempt window)
  const validRecords = records.filter(r => now - r.firstAttemptTime < ATTEMPT_WINDOW);
  
  const record = validRecords.find(r => r.email === email);
  
  if (!record) {
    return { allowed: true, attempts: 0 };
  }

  // Check if currently locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    const minutesLeft = Math.ceil((record.lockedUntil - now) / 60000);
    return {
      allowed: false,
      attempts: record.attempts,
      lockedUntil: record.lockedUntil,
      message: `Account locked. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}`
    };
  }

  // Check if exceeded max attempts
  if (record.attempts >= MAX_ATTEMPTS) {
    const lockedUntil = now + LOCKOUT_DURATION;
    saveRateLimitRecords([
      ...validRecords.filter(r => r.email !== email),
      { ...record, lockedUntil }
    ]);
    return {
      allowed: false,
      attempts: record.attempts,
      lockedUntil,
      message: `Too many login attempts. Account locked for 15 minutes`
    };
  }

  return { allowed: true, attempts: record.attempts };
};

export const recordFailedAttempt = (email: string): void => {
  const records = getRateLimitRecords();
  const now = Date.now();
  
  const validRecords = records.filter(r => now - r.firstAttemptTime < ATTEMPT_WINDOW);
  const record = validRecords.find(r => r.email === email);

  if (record) {
    record.attempts += 1;
  } else {
    validRecords.push({
      email,
      attempts: 1,
      firstAttemptTime: now
    });
  }

  saveRateLimitRecords(validRecords);
};

export const clearRateLimit = (email: string): void => {
  const records = getRateLimitRecords();
  const validRecords = records.filter(r => r.email !== email);
  saveRateLimitRecords(validRecords);
};

// Test email check (dev mode)
export const isTestEmail = (email: string): boolean => {
  const testEmails = [
    'client@atumwa.com',
    'runner@atumwa.com',
    'admin@atumwa.com',
    'pending@atumwa.com'
  ];
  return testEmails.includes(email) && DEV_MODE;
};

// Session token management
const SESSION_TOKEN_KEY = 'atumwa_session_token';
const SESSION_EXPIRY_KEY = 'atumwa_session_expiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const generateSessionToken = (): string => {
  const token = generateToken();
  const expiry = Date.now() + SESSION_DURATION;
  
  sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  sessionStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());
  
  return token;
};

export const getSessionToken = (): string | null => {
  const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
  const expiry = sessionStorage.getItem(SESSION_EXPIRY_KEY);
  
  if (!token || !expiry) return null;
  
  // Check if token has expired
  if (Date.now() > parseInt(expiry)) {
    clearSessionToken();
    return null;
  }
  
  return token;
};

export const clearSessionToken = (): void => {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_EXPIRY_KEY);
};

export const isSessionValid = (): boolean => {
  return getSessionToken() !== null;
};
