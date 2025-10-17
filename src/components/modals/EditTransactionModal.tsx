import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import TransactionForm from '../forms/TransactionForm';

interface TransactionFormData {
  type: 'income' | 'expense';
  date: string;
  description: string;
  category: string;
  value: number;
}

interface Transaction {
  id: string;
  date: Date;
  description: string;
  category: string;
  type: 'entrada' | 'gasto';
  quantity: number;
  value: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  transaction: Transaction | null;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  onUpdateTransaction,
  transaction
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!transaction) {
    return null;
  }

  // Mapear os tipos de transação do modelo para o formulário
  const mapTypeToFormType = (type: 'entrada' | 'gasto'): 'income' | 'expense' => {
    return type === 'entrada' ? 'income' : 'expense';
  };

  // Mapear os tipos de transação do formulário para o modelo
  const mapFormTypeToType = (type: 'income' | 'expense'): 'entrada' | 'gasto' => {
    return type === 'income' ? 'entrada' : 'gasto';
  };

  const initialData: TransactionFormData = {
    type: mapTypeToFormType(transaction.type),
    date: transaction.date.toISOString().split('T')[0],
    description: transaction.description,
    category: transaction.category,
    value: transaction.value
  };

  const handleSubmit = async (data: TransactionFormData) => {
    setIsLoading(true);
    
    try {
      // Simular delay de API (remover em produção)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mapear os dados do formulário para o formato da transação
      const updatedTransaction: Partial<Transaction> = {
        type: mapFormTypeToType(data.type),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        value: data.value
      };
      
      onUpdateTransaction(transaction.id, updatedTransaction);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Editar transação"
      subtitle="Atualize os dados da transação selecionada."
      size="medium"
      showCloseButton={!isLoading}
    >
      <TransactionForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={initialData}
        isLoading={isLoading}
      />
    </Modal>
  );
};