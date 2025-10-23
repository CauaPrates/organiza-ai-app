import { supabase } from './supabaseClient';
import { Transaction, TransactionType } from '../types';

export const transactionService = {
  // Buscar todas as transações do usuário
  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        date: new Date(item.date),
        description: item.description,
        category: item.category,
        type: item.type as TransactionType,
        quantity: item.quantity,
        value: item.quantity,
        userId: item.user_id,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }
  },

  // Adicionar uma nova transação
  async addTransaction(
    transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
    userId: string
  ): Promise<Transaction | null> {
    try {
      const now = new Date().toISOString();

      // Garantir que o valor seja um número válido
      const numericValue = Number(transaction.value);
      if (isNaN(numericValue)) {
        throw new Error('Valor da transação inválido');
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            date: transaction.date.toISOString(),
            description: transaction.description,
            category: transaction.category,
            type: transaction.type,
            quantity: numericValue,
            value: numericValue,
            user_id: userId,
            created_at: now,
            updated_at: now
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        type: data.type as TransactionType,
        quantity: data.quantity,
        value: data.quantity,
        userId: data.user_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      return null;
    }
  },

  // Atualizar uma transação existente
  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const updateData: any = {};

      if (transaction.date) updateData.date = transaction.date.toISOString();
      if (transaction.description) updateData.description = transaction.description;
      if (transaction.category) updateData.category = transaction.category;
      if (transaction.type) updateData.type = transaction.type;
      if (transaction.value !== undefined) {
        const numericValue = Number(transaction.value);
        if (isNaN(numericValue)) {
          throw new Error('Valor da transação inválido');
        }
        updateData.quantity = numericValue;
      }

      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        type: data.type as TransactionType,
        quantity: data.quantity,
        value: data.quantity,
        userId: data.user_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      return null;
    }
  },

  // Excluir uma transação
  async deleteTransaction(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      return false;
    }
  }
};

export default transactionService;
