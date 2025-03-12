export interface Expense {
    id: string;
    name: string;
    amount: number;
    date: string;
    category: string;
  }
  
  export type ExpenseCategory = 
    | 'food'
    | 'transport'
    | 'entertainment'
    | 'utilities'
    | 'shopping'
    | 'health'
    | 'other';
  
  export interface Budget {
    monthlyBalance: number;
    month: string; // Format: YYYY-MM
  }
  
  export interface ExpenseTrackerState {
    budget: Budget;
    expenses: Expense[];
    customCategories: string[];
  }