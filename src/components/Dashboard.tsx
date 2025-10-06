import React from 'react';
import { useFinances } from '../hooks';
import FinancialCard from './ui/FinancialCard';
import TransactionTable from './ui/TransactionTable';
import AddTransactionButton from './ui/AddTransactionButton';

// Types defined locally
enum FinancialCardType {
  ENTRADAS = 'entradas',
  SAIDAS = 'saidas',
  TOTAL = 'total'
}

const Dashboard: React.FC = () => {
  const { user, transactions, summary, addTransaction, updateTransaction, deleteTransaction } = useFinances();

  const handleLogout = () => {
    // Implementar logout futuramente
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container-responsive">
        {/* Header */}
        <div className="card mb-6 py-4 px-6">
          <div className="header-responsive">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quadro da Ana</h1>
              <p className="mt-1" style={{color: '#999'}}>Rastreie seus gastos e lucros!</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-black hover:text-gray-700 transition-colors duration-200"
            >
              sair ↪
            </button>
          </div>
        </div>

        {/* Financial Cards */}
        <div className="grid-responsive mb-4">
          <FinancialCard 
            type={FinancialCardType.ENTRADAS} 
            value={summary.totalEntradas}
            className="animate-fade-in"
          />
          <FinancialCard 
            type={FinancialCardType.SAIDAS} 
            value={summary.totalSaidas}
            className="animate-fade-in"
          />
          <FinancialCard 
            type={FinancialCardType.TOTAL} 
            value={summary.totalFinal}
            className="animate-fade-in"
          />
        </div>

        {/* Transactions Section */}
        <div className="card p-0">
          <div className="px-6 py-4 header-responsive">
            <h2 className="text-lg font-semibold text-gray-900">Transações</h2>
            <AddTransactionButton onClick={() => console.log('Adicionar transação')} />
          </div>
          
          <div className="table-responsive">
            <TransactionTable 
              transactions={transactions}
              onEdit={updateTransaction}
              className="animate-fade-in"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;