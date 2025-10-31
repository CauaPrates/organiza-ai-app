import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinances } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import FinancialCard from '../ui/FinancialCard';
import TransactionTable from '../ui/TransactionTable';
import AddTransactionButton from '../ui/AddTransactionButton';
import { AddTransactionModal } from '../modals/AddTransactionModal';
import { EditTransactionModal } from '../modals/EditTransactionModal';
import { BackgroundModal } from '../modals/BackgroundModal';
import { LogOut, Image } from 'lucide-react';
import { userService } from '../../services/userService';
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
  const { transactions, summary, addTransaction, updateTransaction, deleteTransaction } = useFinances();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [background, setBackground] = useState<{type: 'image' | 'color' | null; value: string | null}>(() => {
    // Inicialmente, usar localStorage como valor temporário até carregar do Supabase
    const savedImage = localStorage.getItem('dashboardBackgroundImage');
    const savedColor = localStorage.getItem('dashboardBackgroundColor');
    
    if (savedImage) return { type: 'image', value: savedImage };
    if (savedColor) return { type: 'color', value: savedColor };
    return { type: 'color', value: '#D9E4EC' };
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, navigate]);
  
  // Carregar o fundo do dashboard do Supabase
  useEffect(() => {
    const fetchBackgroundFromSupabase = async () => {
      try {
        const { data, error } = await userService.getUserBackground();
        
        if (error) {
          console.error('Erro ao buscar fundo do dashboard:', error);
          return;
        }
        
        if (data) {
          setBackground({ 
            type: data.type, 
            value: data.value 
          });
          
          // Atualizar também no localStorage para uso como cache
          if (data.type === 'image') {
            localStorage.setItem('dashboardBackgroundImage', data.value);
            localStorage.removeItem('dashboardBackgroundColor');
          } else {
            localStorage.setItem('dashboardBackgroundColor', data.value);
            localStorage.removeItem('dashboardBackgroundImage');
          }
        }
      } catch (err) {
        console.error('Erro ao buscar fundo do dashboard:', err);
      }
    };
    
    if (isAuthenticated) {
      fetchBackgroundFromSupabase();
    }
  }, [isAuthenticated]);

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
  
  const handleEditTransaction = (id: string, transaction: any) => {
    // marcar 'id' como usado para evitar erro TS6133
    void id;
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
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
  
  const handleOpenBackgroundModal = () => {
    setIsBackgroundModalOpen(true);
  };

  const handleCloseBackgroundModal = () => {
    setIsBackgroundModalOpen(false);
  };
  
  const handleBackgroundChange = async (type: 'image' | 'color', value: string) => {
    // Atualizar estado imediatamente para feedback visual instantâneo
    setBackground({ type, value });
    
    // Atualizar localStorage como cache para carregamento rápido
    localStorage.removeItem('dashboardBackgroundImage');
    localStorage.removeItem('dashboardBackgroundColor');
    
    if (type === 'image') {
      localStorage.setItem('dashboardBackgroundImage', value);
    } else if (type === 'color') {
      localStorage.setItem('dashboardBackgroundColor', value);
    }
    
    // Persistir no Supabase
    try {
      const { error } = await userService.updateUserBackground({
        type,
        value
      });
      
      if (error) {
        console.error('Erro ao salvar fundo no Supabase:', error);
      }
    } catch (err) {
      console.error('Erro ao atualizar fundo do dashboard:', err);
    }
  };
  
  // Funções removidas para resolver erros de build

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  console.log('Dashboard renderizando - isModalOpen:', isModalOpen);

  return (
    <div 
      className="dashboard-container"
      style={
        background.type === 'image' 
          ? { backgroundImage: `url(${background.value})` } 
          : { backgroundColor: background.value || '#D9E4EC' }
      }
    >
      <div className="dashboard-header">
        <h1>Bem-vindo, {authUser?.name || 'Usuário'}!</h1>
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
            onEdit={handleEditTransaction}
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

      {/* Modal para editar transação */}
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        transaction={selectedTransaction}
        onUpdateTransaction={updateTransaction}
      />

      {/* Botão para alterar fundo */}
      <button className="background-change-button" onClick={handleOpenBackgroundModal}>
        <Image size={18} />
        <span>Alterar fundo</span>
      </button>

      {/* Modal para alterar fundo */}
      <BackgroundModal
        isOpen={isBackgroundModalOpen}
        onClose={handleCloseBackgroundModal}
        onBackgroundChange={handleBackgroundChange}
        currentBackground={background}
      />
    </div>
  );
};

export default Dashboard;