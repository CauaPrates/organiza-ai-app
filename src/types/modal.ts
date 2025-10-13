// Tipos para componentes de Modal
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  showCloseButton?: boolean;
  className?: string;
}

// Tipos para transações
export type TransactionType = 'income' | 'expense';
export type LegacyTransactionType = 'entrada' | 'gasto';

export interface TransactionFormData {
  type: TransactionType;
  date: string;
  description: string;
  category: string;
  value: number;
}

export interface LegacyTransaction {
  date: Date;
  description: string;
  category: string;
  type: LegacyTransactionType;
  quantity: number;
  value: number;
}

// Tipos para validação de formulário
export interface ValidationError {
  field: string;
  message: string;
}

// Utilitários de conversão
export const convertTransactionType = (type: TransactionType): LegacyTransactionType => {
  return type === 'income' ? 'entrada' : 'gasto';
};

export const convertLegacyTransactionType = (type: LegacyTransactionType): TransactionType => {
  return type === 'entrada' ? 'income' : 'expense';
};