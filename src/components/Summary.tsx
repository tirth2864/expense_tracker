import React from 'react';
import { Budget, Expense } from '../types';
import { formatCurrency } from '../utils/storage';

interface SummaryProps {
  budget: Budget;
  expenses: Expense[];
}

export const Summary: React.FC<SummaryProps> = ({ budget, expenses }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = budget.monthlyBalance - totalExpenses;
  const isOverBudget = remainingBalance < 0;
  const spentPercentage = (totalExpenses / budget.monthlyBalance) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Budget</h3>
        <p className="text-3xl font-bold text-gray-900">{formatCurrency(budget.monthlyBalance)}</p>
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Expenses</h3>
        <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
        <p className="mt-2 text-sm text-gray-500">
          {spentPercentage.toFixed(1)}% of budget spent
        </p>
      </div>

      <div className={`rounded-2xl shadow-xl p-6 backdrop-blur-lg ${
        isOverBudget 
          ? 'bg-red-50' 
          : 'bg-white bg-opacity-90'
      }`}>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Remaining Balance</h3>
        <p className={`text-3xl font-bold ${
          isOverBudget ? 'text-red-600' : 'text-gray-900'
        }`}>
          {formatCurrency(remainingBalance)}
        </p>
        {isOverBudget && (
          <p className="mt-2 text-sm text-red-600 font-medium">
            Budget exceeded! Reduce expenses.
          </p>
        )}
      </div>
    </div>
  );
};