import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_ATUMWA, MOCK_CLIENT, MOCK_ADMIN } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  verifyUser: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('atumwa_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing user from local storage:', error);
      return null;
    }
  });

  const login = (role: UserRole, simulateUnverified: boolean = false) => {
    let newUser: User | null = null;
    switch (role) {
      case 'client':
        newUser = { ...MOCK_CLIENT, isVerified: true };
        break;
      case 'atumwa':
        newUser = { ...MOCK_ATUMWA, isVerified: !simulateUnverified };
        break;
      case 'admin':
        newUser = MOCK_ADMIN;
        break;
    }
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('atumwa_user', JSON.stringify(newUser));
      sessionStorage.setItem('just_logged_in', 'true');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('atumwa_user');
  };

  const verifyUser = () => {
    if (user) {
      const updatedUser = { ...user, isVerified: true };
      setUser(updatedUser);
      localStorage.setItem('atumwa_user', JSON.stringify(updatedUser));
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('atumwa_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};