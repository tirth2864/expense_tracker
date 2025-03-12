import React, { useState } from 'react';
import { Expense } from '../types';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  categories: string[];
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, categories }) => {
  const [expense, setExpense] = useState({
    name: '',
    description:'',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'other',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expense.amount);
    if (isNaN(amount)) return;

    onSubmit({
      name: expense.name,
      amount,
      date: expense.date,
      category: expense.category,
    });

    setExpense({
      name: '',
      description:'',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'other',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700">
          Expense Name
        </label>
        <input
          type="text"
          id="name"
          value={expense.name}
          onChange={(e) => setExpense({ ...expense, name: e.target.value })}
          className="w-full p-2 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700">
          Description
        </label>
        <input
          type="text"
          id="name"
          value={expense.description}
          onChange={(e) => setExpense({ ...expense, description: e.target.value })}
          className="w-full p-2 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1 text-gray-700">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={expense.amount}
          onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
          className="w-full p-2 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1 text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={expense.date}
          onChange={(e) => setExpense({ ...expense, date: e.target.value })}
          className="w-full p-2 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={expense.category}
          onChange={(e) => setExpense({ ...expense, category: e.target.value })}
          className="w-full p-2 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Add Expense
      </button>
    </form>
  );
};