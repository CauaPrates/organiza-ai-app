interface TransactionFormData {
  type: 'income' | 'expense';
  date: string;
  description: string;
  category: string;
  value: number;
}

export default TransactionFormData;
export type { TransactionFormData };