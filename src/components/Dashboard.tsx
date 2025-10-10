import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinances } from '../hooks';
import { useAuth } from '../contexts/AuthContext';
import FinancialCard from './ui/FinancialCard';
import TransactionTable from './ui/TransactionTable';
import AddTransactionButton from './ui/AddTransactionButton';
import { LogOut, X, Plus } from 'lucide-react';

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
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [transaction, setTransaction] = useState({
    date: new Date(),
    description: '',
    category: '',
    type: 'entrada' as 'entrada' | 'gasto',
    quantity: 1,
    value: 0
  });

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

  const handleOpenOverlay = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    // Reset form
    setTransaction({
      date: new Date(),
      description: '',
      category: '',
      type: 'entrada' as 'entrada' | 'gasto',
      quantity: 1,
      value: 0
    });
  };

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
    addTransaction(transaction);
    handleCloseOverlay();
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
          <div className="card">
            <div className="px-6 py-4 header-responsive">
              <h2 className="text-[35px] font-semibold text-gray-900">Transações</h2>
              <AddTransactionButton onClick={handleOpenOverlay} />
            </div>

            {isOverlayOpen && (
              <div className="modal-container">
                {/* Modal principal */}
                <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md z-10 animate-fade-in">
                  
                  <div className="flex justify-between items-center p-4 border-b">
                    <div>
                      <h2 className="text-xl font-semibold">Adicionar transação</h2>
                      <p className="text-gray-500 text-sm mt-1">
                        Adicione uma nova renda ou despesa para o seu quadro.
                      </p>
                    </div>
                    <button 
                      onClick={handleCloseOverlay}
                      className="btn-logout text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo
                        </label>
                        <select
                          name="type"
                          value={transaction.type}
                          onChange={handleChange}
                          className="input-transaction w-full p-3 border rounded-md appearance-none bg-white"
                          required
                        >
                          <option value="gasto">Gasto</option>
                          <option value="entrada">Entrada</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={transaction.date.toISOString().split('T')[0]}
                          onChange={handleChange}
                          className="input-transaction w-full p-3 border rounded-md"
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
                          className="input-transaction w-full p-3 border rounded-md"
                          placeholder="ex: Comida do cachorro"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoria
                        </label>
                        <select
                          name="category"
                          value={transaction.category}
                          onChange={handleChange}
                          className="input-transaction w-full p-3 border rounded-md appearance-none bg-white"
                          required
                        >
                          <option value="">Selecione uma categoria</option>
                          <option value="Alimentação">Alimentação</option>
                          <option value="Transporte">Transporte</option>
                          <option value="Moradia">Moradia</option>
                          <option value="Lazer">Lazer</option>
                          <option value="Saúde">Saúde</option>
                          <option value="Educação">Educação</option>
                          <option value="Salário">Salário</option>
                          <option value="Outros">Outros</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor
                        </label>
                        <input
                          type="number"
                          name="value"
                          value={transaction.value}
                          onChange={handleChange}
                          className="input-transaction w-full p-3 border rounded-md"
                          placeholder="R$ 0,00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div className="hidden">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={transaction.quantity}
                          onChange={handleChange}
                          className="input-login w-full p-3 border rounded-md"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-10 flex justify-end">
                      <button
                        type="submit"
                        className="btn-add bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <span>Continuar</span>
                        <Plus size={25} className="ml-2" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
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