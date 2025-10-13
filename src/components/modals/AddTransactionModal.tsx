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

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: TransactionFormData) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction
}) => {
  console.log('AddTransactionModal renderizado - isOpen:', isOpen);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TransactionFormData) => {
    setIsLoading(true);
    
    try {
      // Simular delay de API (remover em produção)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onAddTransaction(data);
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      // Aqui você pode adicionar tratamento de erro (toast, etc.)
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
      title="Adicionar transação"
      subtitle="Adicione uma nova renda ou despesa para o seu quadro."
      size="medium"
      showCloseButton={!isLoading}
    >
      <TransactionForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </Modal>
  );
};