import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData } from '../services/authService';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  register: (data: RegisterData) => Promise<User | null>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await authService.login(credentials);
      if (loggedInUser) {
        setUser(loggedInUser);
        return loggedInUser;
      } else {
        setError('Invalid email or password');
        return null;
      }
    } catch (err) {
      setError('An error occurred during login');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await authService.register(data);
      if (newUser) {
        setUser(newUser);
        return newUser;
      } else {
        setError('Email already exists');
        return null;
      }
    } catch (err) {
      setError('An error occurred during registration');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};