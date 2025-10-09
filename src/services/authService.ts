import storageService from './storageService';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface AuthUser extends User {
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Constants
const AUTH_STORAGE_KEY = 'organiza_auth_users';
const CURRENT_USER_KEY = 'organiza_current_user';

// Helper functions
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Auth Service
export const authService = {
  // Get all registered users
  getUsers: (): AuthUser[] => {
    return storageService.get<AuthUser[]>(AUTH_STORAGE_KEY) || [];
  },

  // Register a new user
  register: async (data: RegisterData): Promise<User | null> => {
    const users = authService.getUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === data.email)) {
      return null;
    }

    // Create new user
    const newUser: AuthUser = {
      id: generateId(),
      name: data.name,
      email: data.email,
      password: data.password, // In a real app, this should be hashed
      createdAt: new Date()
    };

    // Save to storage
    storageService.set(AUTH_STORAGE_KEY, [...users, newUser]);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    const users = authService.getUsers();
    
    // Find user by email and password
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return null;
    }

    // Save current user to storage
    const { password, ...userWithoutPassword } = user;
    storageService.set(CURRENT_USER_KEY, userWithoutPassword);
    
    return userWithoutPassword;
  },

  // Get current logged in user
  getCurrentUser: (): User | null => {
    return storageService.get<User>(CURRENT_USER_KEY);
  },

  // Logout user
  logout: (): void => {
    storageService.remove(CURRENT_USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  }
};