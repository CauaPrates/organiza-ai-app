import React from 'react';

interface AddTransactionButtonProps {
  onClick: () => void;
  className?: string;
}

const AddTransactionButton: React.FC<AddTransactionButtonProps> = ({ 
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md ${className}`}
      style={{ fontSize: '0.9rem' }}
    >
      <span>Adicionar transação</span>
      <span className="text-lg font-bold">+</span>
    </button>
  );
};

export default AddTransactionButton;