import React from 'react';
import { Plus } from 'lucide-react';

interface AddTransactionButtonProps {
  onClick: () => void;
  className?: string;
}

const AddTransactionButton: React.FC<AddTransactionButtonProps> = ({ 
  onClick,
  className = 'btn-add'
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className}`}
    >
      <span>Adicionar transação</span>
      <Plus />
    </button>
  );
};

export default AddTransactionButton;