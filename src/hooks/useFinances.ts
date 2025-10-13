import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from '../contexts/AuthContext';

// Types defined locally to avoid import issues
interface User {
  id: string;
  name: string;
  email?: string;
  createdAt: Date;
}

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

interface FinancialSummary {
  totalEntradas: number;
  totalSaidas: number;
  totalFinal: number;
}

interface UseFinancesReturn {
  user: User;
  transactions: Transaction[];
  summary: FinancialSummary;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setUser: (user: User) => void;
}

export const useFinances = (): UseFinancesReturn => {
  const { user: authUser } = useAuth();
  
  // Use authenticated user or fallback to default
  const defaultUser: User = authUser ? {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    createdAt: new Date(),
  } : {
    id: '1',
    name: 'Guest',
    email: 'guest@example.com',
    createdAt: new Date(),
  };

  // Sample transactions for new users
  const sampleTransactions: Transaction[] = [

  ];

  const [user, setUserState] = useLocalStorage<User>('finances_user', defaultUser);
  
  // Get user-specific storage key
  const transactionsKey = `finances_transactions_${user.id}`;
  
  // Initialize with sample data only for new users
  const initialTransactions = localStorage.getItem(transactionsKey) ? [] : 
    sampleTransactions.map(t => ({ ...t, userId: user.id }));
    
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(transactionsKey, initialTransactions);

  // Calculate financial summary
  const summary = useMemo((): FinancialSummary => {
    const totalEntradas = transactions
      .filter(t => t.type === 'entrada')
      .reduce((acc, t) => acc + (Number(t.value) || 0), 0);
    
    const totalSaidas = transactions
      .filter(t => t.type === 'gasto')
      .reduce((acc, t) => acc + (Number(t.value) || 0), 0);
    
    const totalFinal = totalEntradas - totalSaidas;

    return {
      totalEntradas,
      totalSaidas,
      totalFinal,
    };
  }, [transactions]);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id 
          ? { ...transaction, ...updates, updatedAt: new Date() }
          : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const setUser = (newUser: User) => {
    setUserState(newUser);
  };

  return {
    user,
    transactions,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setUser,
  };
};