import React, { useState } from 'react';
import { Budget } from '../types';
import { getCurrentMonth } from '../utils/storage';

interface BudgetFormProps {
  onSubmit: (budget: Budget) => void;
  currentBudget: Budget | null;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit, currentBudget }) => {
  const [amount, setAmount] = useState(currentBudget?.monthlyBalance.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const monthlyBalance = parseFloat(amount);
    if (isNaN(monthlyBalance)) return;

    onSubmit({
      monthlyBalance,
      month: getCurrentMonth(),
    });
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <label htmlFor="budget" className="block text-lg font-medium mb-2 text-gray-700">
          Set Monthly Budget
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            id="budget"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 py-2 px-4 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg w-full sm:w-auto"
            placeholder="Enter amount"
            min="0"
            step="0.01"
            required
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl"
          >
            Set Budget
          </button>
        </div>
      </div>
    </form>
  );
};
