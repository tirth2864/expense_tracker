import { useEffect, useState } from 'react';
import { Budget, Expense,ExpenseTrackerState } from './types';
import { loadState, saveState, getCurrentMonth } from './utils/storage';
import { BudgetForm } from './components/BudgetForm';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Summary } from './components/Summary';
import { CategoryManager } from './components/CategoryManager';
import { MonthlyExpenseSummary } from './components/MonthlyExpenseSummary';

function App() {
  const [state, setState] = useState<ExpenseTrackerState>(() => {
    const savedState = loadState();
    if (savedState && savedState.budget.month === getCurrentMonth()) {
      return {
        ...savedState,
        customCategories: savedState.customCategories || [],
      };
    }
    return {
      budget: { monthlyBalance: 0, month: getCurrentMonth() },
      expenses: [],
      customCategories: [],
    };
  });

  

  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleBudgetSubmit = (budget: Budget) => {
    setState(prev => ({ ...prev, budget }));
  };

  const handleExpenseEdit = (updatedExpense: Expense) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
        ),
    }));
  };

  const handleExpenseSubmit = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
    };
    setState(prev => ({
      ...prev,
      expenses: [...prev.expenses, expense],
    }));
  };

  const handleExpenseDelete = (id: string) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id),
    }));
  };

  const handleAddCategory = (category: string) => {
    if (!state.customCategories.includes(category)) {
      setState(prev => ({
        ...prev,
        customCategories: [...prev.customCategories, category],
      }));
    }
  };

  const handleUndoDelete = (expense: Expense) => {
    setState(prev => ({
      ...prev,
      expenses: [...prev.expenses, expense], // ✅ Corrected
    }));
  };
  
  

  const handleDeleteCategory = (category: string) => {
    setState(prev => ({
      ...prev,
      customCategories: prev.customCategories.filter(c => c !== category),
      expenses: prev.expenses.map(expense => 
        expense.category === category ? { ...expense, category: 'other' } : expense
      ),
    }));
  };

  const allCategories = [
    'food',
    'transport',
    'entertainment',
    'utilities',
    'shopping',
    'health',
    'other',
    ...state.customCategories,
  ];

  const resetFilters = () => {
    setFilter('all'); 
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Expense Tracker
          </h1>
          <p className="text-gray-600">Keep track of your monthly expenses with ease</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90">
          <BudgetForm
            onSubmit={handleBudgetSubmit}
            currentBudget={state.budget}
          />
        </div>

        <Summary
          budget={state.budget}
          expenses={state.expenses}
        />

        <div className='bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90'>
          <MonthlyExpenseSummary expenses={state.expenses}/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Expense</h2>
              <ExpenseForm 
                onSubmit={handleExpenseSubmit}
                categories={allCategories}
              />
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90">
              <CategoryManager
                customCategories={state.customCategories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Expenses</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Categories</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <ExpenseList
              expenses={state.expenses}
              onDelete={handleExpenseDelete}
              onEdit={handleExpenseEdit}
              onUndoDelete={handleUndoDelete}
              filter={filter}
              onResetFilters={resetFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;