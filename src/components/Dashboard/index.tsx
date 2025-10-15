import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinances } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import FinancialCard from '../ui/FinancialCard';
import TransactionTable from '../ui/TransactionTable';
import AddTransactionButton from '../ui/AddTransactionButton';
import { AddTransactionModal } from '../modals/AddTransactionModal';
import { LogOut } from 'lucide-react';
import './Dashboard.css';

// Tipos locais para compatibilidade
interface TransactionFormData {
  type: 'income' | 'expense';
  date: string;
  description: string;
  category: string;
  value: number;
}

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
    console.log('Botão clicado! Estado atual do modal:', isModalOpen);
    setIsModalOpen(true);
    console.log('Modal deveria estar aberto agora');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddTransaction = async (transactionData: TransactionFormData) => {
    try {
      // Converter os dados do formulário para o formato esperado pelo hook
      const transaction = {
        date: new Date(transactionData.date),
        description: transactionData.description,
        category: transactionData.category,
        type: transactionData.type === 'income' ? 'entrada' as const : 'gasto' as const,
        quantity: 1, // Valor fixo já que removemos do formulário
        value: Number(transactionData.value)
      };
      
      await addTransaction(transaction);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error; // Re-throw para que o modal possa tratar o erro
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  console.log('Dashboard renderizando - isModalOpen:', isModalOpen);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bem-vindo, {authUser?.name || user?.name || 'Usuário'}!</h1>
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={20} />
          Sair
        </button>
      </div>

      <div className="dashboard-content">
        <div className="financial-cards">
          <FinancialCard
            type={FinancialCardType.ENTRADAS}
            value={summary.totalEntradas}
          />
          <FinancialCard
            type={FinancialCardType.SAIDAS}
            value={summary.totalSaidas}
          />
          <FinancialCard
            type={FinancialCardType.TOTAL}
            value={summary.totalFinal}
          />
        </div>

        <div className="transactions-section">
          <div className="transactions-header">
            <h2>Transações</h2>
            <AddTransactionButton onClick={handleOpenModal} />
          </div>
          <TransactionTable
            transactions={transactions}
            onEdit={updateTransaction}
            onDelete={deleteTransaction}
          />
        </div>
      </div>

      {/* Modal para adicionar transação */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
};

export default Dashboard;