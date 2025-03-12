import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface CategoryManagerProps {
  customCategories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  customCategories,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim().toLowerCase());
      setNewCategory('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Custom Categories</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category"
          className="flex-1 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="space-y-2">
        {customCategories.map((category) => (
          <div
            key={category}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span className="capitalize">{category}</span>
            <button
              onClick={() => onDeleteCategory(category)}
              className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {customCategories.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No custom categories yet.
          </p>
        )}
      </div>
    </div>
  );
};