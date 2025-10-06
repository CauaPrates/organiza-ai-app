import React from 'react';
import { formatCurrency, formatDate } from '../../utils';

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

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  className?: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  onEdit,
  className = '' 
}) => {
  const getTypeTag = (type: 'entrada' | 'gasto') => {
    if (type === 'entrada') {
      return (
        <span className="tag-entrada">
          entrada
        </span>
      );
    }
    return (
      <span className="tag-gasto">
        gasto
      </span>
    );
  };

  const getValueDisplay = (value: number, type: 'entrada' | 'gasto') => {
    const formattedValue = formatCurrency(Math.abs(value));
    if (type === 'entrada') {
      return <span className="font-medium" style={{color: '#008000'}}>+ {formattedValue}</span>;
    }
    return <span className="font-medium" style={{color: '#FF0000'}}>- {formattedValue}</span>;
  };

  if (transactions.length === 0) {
    return (
      <div className={`card p-8 text-center ${className}`}>
        <p className="text-gray-500">Nenhuma transação encontrada</p>
        <p className="text-sm text-gray-400 mt-1">Adicione sua primeira transação para começar</p>
      </div>
    );
  }

  return (
    <div className={`table-modern ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="table-header">
            <tr>
              <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qtd
              </th>
              <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="table-row">
                <td className="table-cell whitespace-nowrap text-gray-900">
                  {formatDate(transaction.date)}
                </td>
                <td className="table-cell text-gray-900">
                  <div className="max-w-xs truncate" title={transaction.description}>
                    {transaction.description}
                  </div>
                </td>
                <td className="table-cell whitespace-nowrap text-gray-500">
                  {transaction.category}
                </td>
                <td className="table-cell whitespace-nowrap">
                  {getTypeTag(transaction.type)}
                </td>
                <td className="table-cell whitespace-nowrap text-gray-900">
                  {transaction.quantity}
                </td>
                <td className="table-cell whitespace-nowrap">
                  {getValueDisplay(transaction.value, transaction.type)}
                </td>
                <td className="table-cell whitespace-nowrap text-gray-500">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-sm"
                      title="Editar transação"
                    >
                      ✏️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;