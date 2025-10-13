import React, { useState, useRef } from 'react';
import Select from 'react-select';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import './TransactionForm.css';

// Registrar a localização em português
registerLocale('pt-BR', ptBR);

interface TransactionFormData {
  type: 'income' | 'expense';
  date: string;
  description: string;
  category: string;
  value: number;
}

interface ValidationError {
  field: string;
  message: string;
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<TransactionFormData>;
  isLoading?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const datePickerRef = useRef<any>(null);
  
  const [formData, setFormData] = useState<TransactionFormData>({
    type: initialData?.type || 'expense',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    description: initialData?.description || '',
    category: initialData?.category || '',
    value: initialData?.value || 0,
  });

  const [errors, setErrors] = useState<Partial<TransactionFormData>>({});

  const categories = {
    income: [
      'Salário',
      'Freelance',
      'Investimentos',
      'Vendas',
      'Outros',
    ],
    expense: [
      'Alimentação',
      'Transporte',
      'Moradia',
      'Saúde',
      'Educação',
      'Lazer',
      'Compras',
      'Outros',
    ],
  };

  // Opções para react-select
  const typeOptions = [
    { value: 'expense', label: 'Gasto' },
    { value: 'income', label: 'Receita' }
  ];

  const categoryOptions = categories[formData.type].map(category => ({
    value: category,
    label: category
  }));

  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (formData.value <= 0) {
      newErrors.value = 'Valor deve ser maior que zero';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof TransactionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatCurrency = (value: string) => {

    const numbers = value.replace(/\D/g, '');

    const cents = parseInt(numbers) || 0;

    const reais = cents / 100;
    
    return reais;
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = formatCurrency(value);
    handleInputChange('value', numericValue);
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      {/* Tipo */}
      <div className="form-group">
        <label htmlFor="type">Tipo</label>
        <Select
          id="type"
          value={typeOptions.find(option => option.value === formData.type)}
          onChange={(selectedOption) => handleInputChange('type', selectedOption?.value as 'income' | 'expense')}
          options={typeOptions}
          placeholder="Selecione o tipo"
          isSearchable={false}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      {/* Data */}
      <div className="form-group">
        <label htmlFor="date">Data</label>
        <div className="date-picker-wrapper">
          <DatePicker
            ref={datePickerRef}
            id="date"
            selected={formData.date ? new Date(formData.date) : null}
            onChange={(date) => {
              const dateString = date ? date.toISOString().split('T')[0] : '';
              handleInputChange('date', dateString);
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione uma data"
            className={`form-input ${errors.date ? 'error' : ''}`}
            showPopperArrow={false}
            locale="pt-BR"
            popperClassName="right-aligned-calendar"
          />
          <button
            type="button"
            className="date-picker-icon"
            onClick={() => {
              if (datePickerRef.current) {
                datePickerRef.current.setOpen(true);
              }
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
        </div>
        {errors.date && <span className="error-message">{errors.date}</span>}
      </div>

      {/* Descrição */}
      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <input
          id="description"
          type="text"
          placeholder="ex: Comida do cachorro"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`form-input ${errors.description ? 'error' : ''}`}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      {/* Categoria */}
      <div className="form-group">
        <label htmlFor="category">Categoria</label>
        <Select
          id="category"
          value={categoryOptions.find(option => option.value === formData.category)}
          onChange={(selectedOption) => handleInputChange('category', selectedOption?.value || '')}
          options={categoryOptions}
          placeholder="Selecione uma categoria"
          isSearchable={true}
          className={`react-select-container ${errors.category ? 'error' : ''}`}
          classNamePrefix="react-select"
        />
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>

      {/* Valor */}
      <div className="form-group">
        <label htmlFor="value">Valor</label>
        <input
          id="value"
          type="text"
          placeholder="R$ 0,00"
          value={formData.value > 0 ? `R$ ${formData.value.toFixed(2).replace('.', ',')}` : ''}
          onChange={handleValueChange}
          className={`form-input ${errors.value ? 'error' : ''}`}
        />
        {errors.value && <span className="error-message">{errors.value}</span>}
      </div>

      {/* Botões */}
      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Adicionando...' : 'Adicionar transação'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;