import React from 'react';
import { Plus } from 'lucide-react';
import './ui-components.css';

interface AddTransactionButtonProps {
  onClick: () => void;
  className?: string;
}

const AddTransactionButton: React.FC<AddTransactionButtonProps> = ({ 
  onClick,
  className = 'btn-primary'
}) => {
  return (
    <button 
      className={className}
      onClick={onClick}
    >
      <span>Adicionar transação</span>
      <Plus />
    </button>
  );
};

export default AddTransactionButton;