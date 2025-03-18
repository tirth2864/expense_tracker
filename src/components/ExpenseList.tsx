import React, { useState } from 'react';
import { Expense } from '../types';
import { formatCurrency } from '../utils/storage';
import { Trash2, Edit2, Check, X, Undo } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (updatedExpense: Expense) => void;
  onUndoDelete: (expense: Expense) => void;  // New function to re-add the deleted expense
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
    if (deletedExpense) {
      onUndoDelete(deletedExpense); // Correctly restore the deleted expense
      setDeletedExpense(null);
      setShowUndo(false);
    }
    if (undoTimeout) {
      clearTimeout(undoTimeout);
      setUndoTimeout(null);
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

        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl"
        >
          Reset
        </button>
      </div>

      {filteredExpenses.map((expense) => (
        <div key={expense.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          {editExpenseId === expense.id ? (
            <div className="flex-1 space-y-2">
              <input type="text" value={editedExpense?.name || ''} onChange={(e) => setEditedExpense({ ...editedExpense!, name: e.target.value })} className="w-full p-2 border rounded-lg" />
              <input type="number" value={editedExpense?.amount || ''} onChange={(e) => setEditedExpense({ ...editedExpense!, amount: parseFloat(e.target.value) || 0 })} className="w-full p-2 border rounded-lg" />
              <input type="date" value={editedExpense?.date || ''} onChange={(e) => setEditedExpense({ ...editedExpense!, date: e.target.value })} className="w-full p-2 border rounded-lg" />
              <select value={editedExpense?.category || ''} onChange={(e) => setEditedExpense({ ...editedExpense!, category: e.target.value })} className="w-full p-2 border rounded-lg">
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
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{expense.name}</h3>
              <div className="text-sm text-gray-500">
                <span>{expense.date}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{expense.category}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {editExpenseId === expense.id ? (
              <>
                <button onClick={handleSaveClick} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                  <Check size={18} />
                </button>
                <button onClick={() => setEditExpenseId(null)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                <span className="font-medium text-gray-900">{formatCurrency(expense.amount)}</span>
                <button onClick={() => handleEditClick(expense)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(expense.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Undo Pop-up */}
      {showUndo && (
        <div className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-lg flex items-center gap-4 shadow-lg">
          <p>Expense deleted.</p>
          <button onClick={handleUndo} className="text-blue-400 hover:text-blue-300 flex items-center">
            <Undo size={16} className="mr-1" />
            Undo
          </button>
        </div>
      )}
    </div>
  );
};
