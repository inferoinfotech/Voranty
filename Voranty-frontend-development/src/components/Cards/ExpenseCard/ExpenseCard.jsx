import React from 'react';
import edit_image from "../../../assets/images/background/edit_image.svg";

const ExpenseCard = ({ 
  expense,
  isSelected, 
  onSelect, 
  onCardClick 
}) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className="bg-gradient-to-r from-[#0B2838] to-[#1a4459] p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(expense._id)}
              className="cursor-pointer h-5 w-5 rounded-md accent-white"
            />
            <h2 className="text-white text-xl font-bold truncate">{expense.merchant}</h2>
          </div>
          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {expense.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 rounded-lg p-3 hover:bg-gray-100 transition-colors">
            <p className="text-md text-gray-500 font-medium mb-1">Date</p>
            <p className="text-sm text-gray-800 font-medium">
              {new Date(expense.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3 hover:bg-gray-100 transition-colors">
            <p className="text-md text-gray-500 font-medium mb-1">Warranty Until</p>
            <p className="text-sm text-gray-800 font-medium">
            {expense.warrentyDate 
            ? new Date(expense.warrentyDate).toLocaleDateString('en-GB') 
            : 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-md text-gray-500 font-medium mb-1">Amount</p>
            <p className="text-2xl font-bold text-[#0B2838]">₹{expense.amount.toFixed(2)}</p>
          </div>
          <div
            onClick={() => onCardClick(expense._id)}
            className="relative group cursor-pointer"
          >
            <div className="h-24 w-24 rounded-lg overflow-hidden ring-2 ring-gray-100 group-hover:ring-[#0B2838] transition-all duration-300">
              <img
                src={expense.imageUrl || edit_image}
                alt="Receipt"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-md text-gray-500 font-medium mb-2">Description</p>
          <p className="text-sm text-gray-700 line-clamp-2">
            {expense.description || "No description provided"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard; 