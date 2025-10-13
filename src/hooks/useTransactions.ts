
import { useState, useMemo } from 'react';

// Types defined locally
type TransactionType = 'entrada' | 'gasto';

interface Transaction {
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

interface UseTransactionsOptions {
  transactions: Transaction[];
  onAdd?: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (id: string, transaction: Partial<Transaction>) => void;
  onDelete?: (id: string) => void;
}

interface UseTransactionsReturn {
  filteredTransactions: Transaction[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: TransactionType | 'all';
  setFilterType: (type: TransactionType | 'all') => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  sortBy: 'date' | 'value' | 'description';
  setSortBy: (sort: 'date' | 'value' | 'description') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

export const useTransactions = ({
  transactions,
  onAdd,
  onUpdate,
  onDelete,
}: UseTransactionsOptions): UseTransactionsReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'description'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filterType);
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(transaction => transaction.category === filterCategory);
    }

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, searchTerm, filterType, filterCategory, sortBy, sortOrder]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    onAdd?.(transaction);
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    onUpdate?.(id, transaction);
  };

  const deleteTransaction = (id: string) => {
    onDelete?.(id);
  };

  return {
    filteredTransactions,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};