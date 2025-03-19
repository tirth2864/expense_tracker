import React, { useState } from 'react';
import { Expense } from '../types';
import { formatCurrency } from '../utils/storage';
import { Trash2, Edit2, Check, X, Undo } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (updatedExpense: Expense) => void;
  onUndoDelete: (expense: Expense) => void;
  filter: string;
  onResetFilters: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onEdit, onUndoDelete, filter, onResetFilters }) => {
  const [editExpenseId, setEditExpenseId] = useState<string | null>(null);
  const [editedExpense, setEditedExpense] = useState<Expense | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deletedExpense, setDeletedExpense] = useState<Expense | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [undoTimeout, setUndoTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Filter expenses by category and date range
  const filteredExpenses = expenses.filter(({ category, date }) => {
    const matchesCategory = filter === 'all' || category === filter;
    const expenseDate = new Date(date);
    return matchesCategory && (!startDate || new Date(startDate) <= expenseDate) && (!endDate || expenseDate <= new Date(endDate));
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

  const handleDelete = (id: string) => {
    const expenseToDelete = expenses.find((exp) => exp.id === id);
    if (!expenseToDelete) return;
    setDeletedExpense(expenseToDelete);
    setShowUndo(true);
    onDelete(id);

    const timeout = setTimeout(() => {
      setDeletedExpense(null);
      setShowUndo(false);
    }, 5000);

    setUndoTimeout(timeout);
  };

  const handleUndo = () => {
    if (deletedExpense) onUndoDelete(deletedExpense);
    setDeletedExpense(null);
    setShowUndo(false);
    if (undoTimeout) clearTimeout(undoTimeout);
  };

  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-none">

      {/* Date Filter Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white shadow-md rounded-lg">
        {['Start Date', 'End Date'].map((label, idx) => (
          <div key={label} className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="date"
              value={idx === 0 ? startDate : endDate}
              onChange={(e) => (idx === 0 ? setStartDate(e.target.value) : setEndDate(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        ))}
        <button
          onClick={clearFilters}
          className="self-end px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg"
        >
          Reset
        </button>
      </div>

      {/* Expense List */}
      {filteredExpenses.map(({ id, name, amount, date, category }) => (
        <div key={id} className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
          {editExpenseId === id ? (
            <div className="flex-1 space-y-2">
              {['name', 'amount', 'date', 'category'].map((field) => (
                <input
                  key={field}
                  type={field === 'amount' ? 'number' : field === 'date' ? 'date' : 'text'}
                  value={(editedExpense as any)?.[field] || ''}
                  onChange={(e) => setEditedExpense({ ...editedExpense!, [field]: field === 'amount' ? parseFloat(e.target.value) || 0 : e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-lg">{name}</h3>
              <div className="text-sm text-gray-500 flex gap-2">
                <span className="bg-gray-100 px-2 py-1 rounded-md">{date}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-md capitalize">{category}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {editExpenseId === id ? (
              <>
                <button onClick={handleSaveClick} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                  <Check size={20} />
                </button>
                <button onClick={() => setEditExpenseId(null)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <span className="font-semibold text-gray-800 text-lg">{formatCurrency(amount)}</span>
                <button onClick={() => handleEditClick({ id, name, amount, date, category })} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit2 size={20} />
                </button>
                <button onClick={() => handleDelete(id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Undo Snackbar */}
      {showUndo && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-lg flex items-center gap-4 shadow-lg">
          <p>Expense deleted.</p>
          <button onClick={handleUndo} className="text-blue-400 hover:text-blue-300 flex items-center">
            <Undo size={16} className="mr-1" />Undo
          </button>
        </div>
      )}
    </div>
  );
};
