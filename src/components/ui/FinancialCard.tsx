import React from 'react';

// Types defined locally
enum FinancialCardType {
  ENTRADAS = 'entradas',
  SAIDAS = 'saidas',
  TOTAL = 'total'
}

interface FinancialCardProps {
  type: FinancialCardType;
  value: number;
  className?: string;
}
import { formatCurrency } from '../../utils';

const FinancialCard: React.FC<FinancialCardProps> = ({ type, value, className = '' }) => {
  const getCardConfig = () => {
    switch (type) {
      case FinancialCardType.ENTRADAS:
        return {
          title: 'Total de entradas',
          icon: '↗',
          cardClass: 'financial-card financial-card-entradas',
          textColor: '#008000',
          iconColor: '#008000'
        };
      case FinancialCardType.SAIDAS:
        return {
          title: 'Total de saídas',
          icon: '↘',
          cardClass: 'financial-card financial-card-saidas',
          textColor: '#FF0000',
          iconColor: '#FF0000'
        };
      case FinancialCardType.TOTAL:
        return {
          title: 'Total final',
          icon: '💰',
          cardClass: 'financial-card financial-card-total',
          textColor: '#6B7B74',
          iconColor: '#6B7B74'
        };
      default:
        return {
          title: 'Total',
          icon: '=',
          cardClass: 'financial-card',
          textColor: 'text-gray-600',
          iconColor: 'text-gray-500'
        };
    }
  };

  const config = getCardConfig();

  return (
    <div className={`${config.cardClass} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-black mb-1">
            {config.title}
          </p>
          <p className="text-2xl font-bold" style={{color: config.textColor}}>
            {formatCurrency(value)}
          </p>
        </div>
        <div className="text-2xl" style={{color: config.iconColor}}>
          {config.icon}
        </div>
      </div>
    </div>
  );
};

export default FinancialCard;