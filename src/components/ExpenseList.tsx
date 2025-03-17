import React, { useState } from 'react';
import { Expense } from '../types';
import { formatCurrency } from '../utils/storage';
import { Trash2, Edit2, Check, X } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (updatedExpense: Expense) => void; 
  filter: string;
  onResetFilters: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onEdit, filter, onResetFilters }) => {
  const [editExpenseId, setEditExpenseId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [editedExpense, setEditedExpense] = useState<Expense | null>(null);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = filter === 'all' || expense.category === filter;
    const expenseDate = new Date(expense.date);
    const withinDateRange =
      (!startDate || new Date(startDate) <= expenseDate) &&
      (!endDate || expenseDate <= new Date(endDate));

    return matchesCategory && withinDateRange;
  });

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    onResetFilters();
  };

  const handleEditClick = (expense: Expense) => {
    setEditExpenseId(expense.id);
    setEditedExpense({ ...expense });
  };

  const handleSaveClick = () => {
    if (editedExpense) {
      onEdit(editedExpense);
      setEditExpenseId(null);
      setEditedExpense(null);
    }
  };

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
      {/* Date Range Filter */}
      <div className="mb-4 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl"
        >
          Reset
        </button>
      </div>

      {filteredExpenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          {editExpenseId === expense.id ? (
            // Edit Mode
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={editedExpense?.name || ''}
                onChange={(e) => setEditedExpense({ ...editedExpense!, name: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                value={editedExpense?.amount || ''}
                onChange={(e) => setEditedExpense({ ...editedExpense!, amount: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="date"
                value={editedExpense?.date || ''}
                onChange={(e) => setEditedExpense({ ...editedExpense!, date: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
              <select
                value={editedExpense?.category || ''}
                onChange={(e) => setEditedExpense({ ...editedExpense!, category: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="entertainment">Entertainment</option>
                <option value="utilities">Utilities</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>
          ) : (
            // View Mode
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{expense.name}</h3>
              <div className="text-sm text-gray-500">
                <span>{expense.date}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{expense.category}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            {editExpenseId === expense.id ? (
              <>
                <button
                  onClick={handleSaveClick}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => setEditExpenseId(null)}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                <span className="font-medium text-gray-900">{formatCurrency(expense.amount)}</span>
                <button
                  onClick={() => handleEditClick(expense)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {filteredExpenses.length === 0 && (
        <p className="text-center text-gray-500 py-8">No expenses found</p>
      )}
    </div>
  );
};
