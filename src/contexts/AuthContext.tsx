import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { User, AuthCredentials as LoginCredentials, RegisterData } from '../types';
import { userService } from '../services/userService';

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
    const checkUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Erro ao verificar usuário:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.login(credentials);
      if (response.error) {
        setError(response.error.message);
        return null;
      }
      
      if (response.user) {
        setUser(response.user);
         return response.user;
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
      const response = await userService.register(data);
      if (response.error) {
        setError(response.error.message);
        return null;
      }
      
      if (response.user) {
        setUser(response.user);
        return response.user;
      } else {
        setError('Falha no registro');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Falha no registro';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await userService.logout();
      if (error) {
        console.error('Erro ao fazer logout:', error);
      }
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      setUser(null);
    }
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