// src/types/index.ts
export type { BaseModalProps, TransactionFormData } from './modal';

export interface ComponentWithClassName {
  className?: string;
}

// Tipos para usuários
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Tipos para transações
export type TransactionType = 'entrada' | 'gasto';

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  category: string;
  type: TransactionType;
  quantity: number;
  value: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para resumo financeiro
export interface FinancialSummary {
  totalEntradas: number;
  totalSaidas: number;
  totalFinal: number;
}

// Tipos para autenticação
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
}

export interface AuthResponse {
  user: User | null;
  session: any;
  error: Error | null;
}

// Tipos para fundo do dashboard
export type DashboardBackgroundType = 'color' | 'image';

export interface DashboardBackground {
  type: DashboardBackgroundType;
  value: string;
}