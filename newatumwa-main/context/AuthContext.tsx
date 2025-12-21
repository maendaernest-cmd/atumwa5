import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthCredentials, SignUpFormData, AuthError } from '../types';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  isValidEmail,
  validatePasswordStrength,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  isTestEmail,
  generateSessionToken,
  getSessionToken,
  clearSessionToken,
  isSessionValid
} from '../utils/authUtils';
import { MOCK_ATUMWA, MOCK_CLIENT, MOCK_ADMIN } from '../constants';

const DEV_MODE = process.env.REACT_APP_DEV_MODE === 'true';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  
  // Auth actions
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (formData: SignUpFormData) => Promise<void>;
  logout: () => void;
  
  // Password management
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  
  // Email verification
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  
  // User management
  updateUser: (data: Partial<User>) => void;
  
  // Dev mode helpers
  loginAsTestUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'atumwa_users';
const CURRENT_USER_KEY = 'atumwa_user';
const TOKENS_STORAGE_KEY = 'atumwa_tokens';

// Initialize with mock users for development
const initializeDefaultUsers = (): User[] => {
  const defaultUsers: User[] = [
    {
      id: 'mock_client_1',
      name: 'Test Client',
      email: 'client@atumwa.com',
      role: 'client',
      avatar: '/avatars/client.png',
      rating: 4.8,
      location: 'Harare',
      jobsCompleted: 45,
      isVerified: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failedLoginAttempts: 0,
      passwordHash: hashPassword('any')
    },
    {
      id: 'mock_runner_1',
      name: 'Test Runner',
      email: 'runner@atumwa.com',
      role: 'atumwa',
      avatar: '/avatars/runner.png',
      rating: 4.9,
      location: 'Harare',
      jobsCompleted: 120,
      isVerified: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failedLoginAttempts: 0,
      passwordHash: hashPassword('any')
    },
    {
      id: 'mock_admin_1',
      name: 'Test Admin',
      email: 'admin@atumwa.com',
      role: 'admin',
      avatar: '/avatars/admin.png',
      rating: 5.0,
      location: 'Harare',
      isVerified: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failedLoginAttempts: 0,
      passwordHash: hashPassword('any')
    },
    {
      id: 'mock_pending_1',
      name: 'Pending Runner',
      email: 'pending@atumwa.com',
      role: 'atumwa',
      avatar: '/avatars/pending.png',
      rating: 0,
      location: 'Harare',
      isVerified: false,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failedLoginAttempts: 0,
      passwordHash: hashPassword('any')
    }
  ];
  return defaultUsers;
};

const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error parsing stored users:', error);
  }
  return initializeDefaultUsers();
};

const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Initialize user from storage and session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if session is still valid
        if (!isSessionValid()) {
          clearSessionToken();
          setUser(null);
          setLoading(false);
          return;
        }

        // Try to restore user from localStorage
        const savedUser = localStorage.getItem(CURRENT_USER_KEY);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: AuthCredentials): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { email, password } = credentials;

      // Validate input
      if (!email || !password) {
        throw {
          code: 'INVALID_INPUT',
          message: 'Email and password are required'
        };
      }

      // Check rate limiting
      const rateLimitCheck = checkRateLimit(email);
      if (!rateLimitCheck.allowed) {
        throw {
          code: 'ACCOUNT_LOCKED',
          message: rateLimitCheck.message || 'Account is temporarily locked'
        };
      }

      // Get stored users
      let users = getStoredUsers();
      const storedUser = users.find(u => u.email === email);

      // DEV_MODE: Allow test emails with any password
      if (DEV_MODE && isTestEmail(email)) {
        const mockUser = users.find(u => u.email === email);
        if (mockUser) {
          clearRateLimit(email);
          const sessionToken = generateSessionToken();
          mockUser.lastLoginAt = new Date().toISOString();
          mockUser.failedLoginAttempts = 0;
          saveUsers(users);
          setUser(mockUser);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockUser));
          setLoading(false);
          return;
        }
      }

      // Production mode: Verify password
      if (!storedUser) {
        recordFailedAttempt(email);
        throw {
          code: 'USER_NOT_FOUND',
          message: 'Invalid email or password'
        };
      }

      if (!storedUser.passwordHash || !verifyPassword(password, storedUser.passwordHash)) {
        recordFailedAttempt(email);
        throw {
          code: 'INVALID_PASSWORD',
          message: 'Invalid email or password'
        };
      }

      // Check if email is verified
      if (!storedUser.emailVerified) {
        throw {
          code: 'EMAIL_NOT_VERIFIED',
          message: 'Please verify your email before logging in'
        };
      }

      // Check if account is pending approval (for messengers)
      if (storedUser.role === 'atumwa' && !storedUser.isVerified) {
        throw {
          code: 'PENDING_APPROVAL',
          message: 'Your account is pending admin approval'
        };
      }

      // Successful login
      clearRateLimit(email);
      const sessionToken = generateSessionToken();
      
      storedUser.lastLoginAt = new Date().toISOString();
      storedUser.failedLoginAttempts = 0;
      saveUsers(users);
      
      setUser(storedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(storedUser));
    } catch (err: any) {
      const authError: AuthError = {
        code: err.code || 'LOGIN_FAILED',
        message: err.message || 'Login failed. Please try again.',
        field: err.field
      };
      setError(authError);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData: SignUpFormData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { name, email, password, confirmPassword, role, agreeToTerms } = formData;

      // Validate input
      if (!name || !email || !password) {
        throw {
          code: 'MISSING_FIELDS',
          message: 'All fields are required'
        };
      }

      if (!agreeToTerms) {
        throw {
          code: 'TERMS_NOT_AGREED',
          message: 'You must agree to the terms and conditions'
        };
      }

      // Validate email format
      if (!isValidEmail(email)) {
        throw {
          code: 'INVALID_EMAIL',
          message: 'Invalid email format',
          field: 'email'
        };
      }

      // Validate password
      if (password !== confirmPassword) {
        throw {
          code: 'PASSWORD_MISMATCH',
          message: 'Passwords do not match',
          field: 'confirmPassword'
        };
      }

      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw {
          code: 'WEAK_PASSWORD',
          message: passwordValidation.errors[0],
          field: 'password'
        };
      }

      // Check if email already exists
      const users = getStoredUsers();
      if (users.some(u => u.email === email)) {
        throw {
          code: 'EMAIL_EXISTS',
          message: 'An account with this email already exists',
          field: 'email'
        };
      }

      // Create new user
      const newUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        avatar: `/avatars/${role}.png`,
        rating: 0,
        location: '',
        jobsCompleted: 0,
        isVerified: role === 'client', // Clients auto-verified, messengers need approval
        emailVerified: false,
        passwordHash: hashPassword(password),
        emailVerificationToken: generateToken(),
        emailVerificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        failedLoginAttempts: 0
      };

      users.push(newUser);
      saveUsers(users);

      // In production: Send verification email here
      // await sendVerificationEmail(email, newUser.emailVerificationToken);

      // For now, auto-verify in dev mode
      if (DEV_MODE) {
        newUser.emailVerified = true;
        newUser.emailVerificationToken = undefined;
        newUser.emailVerificationTokenExpiry = undefined;
        saveUsers(users);
      }

      // Log the user in
      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    } catch (err: any) {
      const authError: AuthError = {
        code: err.code || 'SIGNUP_FAILED',
        message: err.message || 'Signup failed. Please try again.',
        field: err.field
      };
      setError(authError);
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    clearSessionToken();
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    setError(null);
  };

  const requestPasswordReset = async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      if (!isValidEmail(email)) {
        throw {
          code: 'INVALID_EMAIL',
          message: 'Invalid email format'
        };
      }

      const users = getStoredUsers();
      const userToReset = users.find(u => u.email === email);

      if (!userToReset) {
        // Don't reveal if email exists (security best practice)
        throw {
          code: 'RESET_SENT',
          message: 'If an account exists, a reset link has been sent to your email'
        };
      }

      const resetToken = generateToken();
      userToReset.passwordResetToken = resetToken;
      userToReset.passwordResetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      userToReset.updatedAt = new Date().toISOString();
      
      saveUsers(users);

      // In production: Send reset email here
      // await sendPasswordResetEmail(email, resetToken);
    } catch (err: any) {
      const authError: AuthError = {
        code: err.code || 'RESET_FAILED',
        message: err.message || 'Password reset failed'
      };
      setError(authError);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        throw {
          code: 'WEAK_PASSWORD',
          message: passwordValidation.errors[0]
        };
      }

      const users = getStoredUsers();
      const userToReset = users.find(u => 
        u.passwordResetToken === token && 
        u.passwordResetTokenExpiry && 
        new Date(u.passwordResetTokenExpiry) > new Date()
      );

      if (!userToReset) {
        throw {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired reset token'
        };
      }

      userToReset.passwordHash = hashPassword(newPassword);
      userToReset.passwordResetToken = undefined;
      userToReset.passwordResetTokenExpiry = undefined;
      userToReset.updatedAt = new Date().toISOString();
      
      saveUsers(users);
    } catch (err: any) {
      const authError: AuthError = {
        code: err.code || 'RESET_FAILED',
        message: err.message || 'Password reset failed'
      };
      setError(authError);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const users = getStoredUsers();
      const userToVerify = users.find(u => 
        u.emailVerificationToken === token &&
        u.emailVerificationTokenExpiry &&
        new Date(u.emailVerificationTokenExpiry) > new Date()
      );

      if (!userToVerify) {
        throw {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired verification token'
        };
      }

      userToVerify.emailVerified = true;
      userToVerify.emailVerificationToken = undefined;
      userToVerify.emailVerificationTokenExpiry = undefined;
      userToVerify.updatedAt = new Date().toISOString();
      
      saveUsers(users);
      
      if (user?.id === userToVerify.id) {
        setUser(userToVerify);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToVerify));
      }
    } catch (err: any) {
      const authError: AuthError = {
        code: err.code || 'VERIFICATION_FAILED',
        message: err.message || 'Email verification failed'
      };
      setError(authError);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const users = getStoredUsers();
      const userToVerify = users.find(u => u.email === email);

      if (!userToVerify) {
        throw {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        };
      }

      if (userToVerify.emailVerified) {
        throw {
          code: 'ALREADY_VERIFIED',
          message: 'Email is already verified'
        };
      }

      const newToken = generateToken();
      userToVerify.emailVerificationToken = newToken;
      userToVerify.emailVerificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      saveUsers(users);

      // In production: Send verification email here
      // await sendVerificationEmail(email, newToken);
    } catch (err: any) {
      const authError: AuthError = {
        code: err.code || 'RESEND_FAILED',
        message: err.message || 'Failed to resend verification email'
      };
      setError(authError);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (data: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...data, updatedAt: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      
      // Update in stored users
      const users = getStoredUsers();
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex > -1) {
        users[userIndex] = updatedUser;
        saveUsers(users);
      }
    }
  };

  const loginAsTestUser = (role: UserRole): void => {
    const users = getStoredUsers();
    const testUser = users.find(u => u.role === role);
    if (testUser) {
      generateSessionToken();
      setUser(testUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(testUser));
      setError(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        requestPasswordReset,
        resetPassword,
        verifyEmail,
        resendVerificationEmail,
        updateUser,
        loginAsTestUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
