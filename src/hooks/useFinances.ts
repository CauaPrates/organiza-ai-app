import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Transaction, TransactionType, FinancialSummary } from '../types';
import { transactionService } from '../services/transactionService';

interface UseFinancesReturn {
  transactions: Transaction[];
  summary: FinancialSummary;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useFinances = (): UseFinancesReturn => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar transações do usuário
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await transactionService.getTransactions(user.id);
        setTransactions(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar transações:', err);
        setError('Falha ao carregar transações');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

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

  // Adicionar transação
  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const newTransaction = await transactionService.addTransaction(transactionData, user.id);
      
      if (newTransaction) {
        setTransactions(prev => [newTransaction, ...prev]);
      }
    } catch (err) {
      console.error('Erro ao adicionar transação:', err);
      setError('Falha ao adicionar transação');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar transação
  const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
    try {
      setLoading(true);
      const updatedTransaction = await transactionService.updateTransaction(id, transactionData);
      
      if (updatedTransaction) {
        setTransactions(prev => 
          prev.map(t => t.id === id ? updatedTransaction : t)
        );
      }
    } catch (err) {
      console.error('Erro ao atualizar transação:', err);
      setError('Falha ao atualizar transação');
    } finally {
      setLoading(false);
    }
  };

  // Excluir transação
  const deleteTransaction = async (id: string) => {
    try {
      setLoading(true);
      const success = await transactionService.deleteTransaction(id);
      
      if (success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Erro ao excluir transação:', err);
      setError('Falha ao excluir transação');
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
    error
  };
};