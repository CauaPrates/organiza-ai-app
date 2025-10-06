// Application constants

export const APP_CONFIG = {
  name: 'My Finances',
  version: '1.0.0',
  description: 'Controle financeiro pessoal moderno e intuitivo',
  defaultUser: 'Ana',
} as const;

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  retryAttempts: 3,
} as const;

export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  profile: '/profile',
  settings: '/settings',
  login: '/login',
  register: '/register',
} as const;

export const STORAGE_KEYS = {
  user: 'user',
  token: 'auth_token',
  theme: 'app_theme',
  language: 'app_language',
} as const;

export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px',
} as const;

export const COLORS = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  background: '#D9E4EC',
  entrada: '#10B981',
  gasto: '#EF4444',
  total: '#6B7280',
};

// Financial Categories
export const TRANSACTION_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Entretenimento',
  'Compras',
  'Investimentos',
  'Salário',
  'Freelance',
  'Outros',
] as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  ENTRADA: 'entrada' as const,
  GASTO: 'gasto' as const,
};

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;