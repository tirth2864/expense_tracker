import React from 'react';
import { Expense } from '../types';
import { formatCurrency } from '../utils/storage';
import { Trash2 } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  filter: string;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, filter }) => {
  const filteredExpenses = filter === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === filter);

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
      {filteredExpenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{expense.name}</h3>
            <div className="text-sm text-gray-500">
              <span>{expense.date}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{expense.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-900">{formatCurrency(expense.amount)}</span>
            <button
              onClick={() => onDelete(expense.id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
      {filteredExpenses.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No expenses found.
        </p>
      )}
    </div>
  );
};