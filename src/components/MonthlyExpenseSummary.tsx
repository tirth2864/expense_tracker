import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Expense } from '../types';

interface MonthlyExpenseSummaryProps {
  expenses: Expense[];
}

export const MonthlyExpenseSummary: React.FC<MonthlyExpenseSummaryProps> = ({ expenses }) => {
  const categoryTotals: { [key: string]: number } = {};

  expenses.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  const data = Object.keys(categoryTotals).map((category) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: categoryTotals[category],
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#ff6666'];

  return (
    <div className="w-full h-64">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expense Breakdown</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
