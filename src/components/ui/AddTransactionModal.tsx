import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transaction: {
    date: Date;
    description: string;
    category: string;
    type: 'entrada' | 'gasto';
    quantity: number;
    value: number;
  }) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [transaction, setTransaction] = useState({
    date: new Date(),
    description: '',
    category: '',
    type: 'entrada' as 'entrada' | 'gasto',
    quantity: 1,
    value: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'date') {
      setTransaction({ ...transaction, date: new Date(value) });
    } else if (name === 'quantity' || name === 'value') {
      setTransaction({ ...transaction, [name]: parseFloat(value) || 0 });
    } else {
      setTransaction({ ...transaction, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(transaction);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Nova Transação</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                name="date"
                value={transaction.date.toISOString().split('T')[0]}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <input
                type="text"
                name="description"
                value={transaction.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Descreva a transação"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <input
                type="text"
                name="category"
                value={transaction.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Ex: Alimentação, Transporte, Salário"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                name="type"
                value={transaction.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="entrada">Entrada</option>
                <option value="gasto">Gasto</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade
              </label>
              <input
                type="number"
                name="quantity"
                value={transaction.quantity}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                min="1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                name="value"
                value={transaction.value}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;