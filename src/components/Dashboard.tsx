import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinances } from '../hooks';
import { useAuth } from '../contexts/AuthContext';
import FinancialCard from './ui/FinancialCard';
import TransactionTable from './ui/TransactionTable';
import AddTransactionButton from './ui/AddTransactionButton';
import AddTransactionModal from './ui/AddTransactionModal';
import { LogOut } from 'lucide-react';

// Types defined locally
enum FinancialCardType {
  ENTRADAS = 'entradas',
  SAIDAS = 'saidas',
  TOTAL = 'total'
}

const Dashboard: React.FC = () => {
  const { user: authUser, logout, isAuthenticated } = useAuth();
  const { user, transactions, summary, addTransaction, updateTransaction, deleteTransaction } = useFinances();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddTransaction = (transaction: {
    date: Date;
    description: string;
    category: string;
    type: 'entrada' | 'gasto';
    quantity: number;
    value: number;
  }) => {
    addTransaction(transaction);
  };

  if (!authUser || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className='dashboard-container'>
    <div className="min-h-screen animate-fade-in">
      <div className="container-responsive">
        {/* Header */}
        <div className="card mb-6 py-4 px-6">
          <div className="header-responsive flex items-start">
            <div className='text-left leading-tight'>
              <h1 className="text-[35px] font-bold text-gray-900">Quadro de {authUser.name}</h1>
              <p className="mt-1" style={{color: '#999'}}>Rastreie seus gastos e lucros!</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-logout"
            >
              <span>Sair</span>
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Financial Cards */}
        <div className="grid-responsive valuesContainer">
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
            <h2 className="text-[35px] font-semibold text-gray-900">Transações</h2>
            <AddTransactionButton onClick={handleOpenModal} />
            <AddTransactionModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleAddTransaction}
          />
          
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
    </div>
  );
};

export default Dashboard;