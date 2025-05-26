import React from 'react';
import { FiFilter, FiRefreshCcw } from "react-icons/fi";

const ExpenseFilters = ({ 
  showFilters, 
  setShowFilters, 
  filters, 
  setFilters, 
  resetFilters,
  categories 
}) => {
  return (
    <div className="p-4 mt-20">
      {/* Show Filters Button */}
      <div className="flex items-center space-x-2 ">
        <button
          className="text-[#2095d9] hover:text-[#37B5FF] flex items-center space-x-2 mb-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter className="text-xl" />
          <span className="text-lg font-bold">
            {showFilters ? "Hide Filters" : "Show Filters"}
          </span>
        </button>
        {Object.values(filters).some((value) => value) && (
          <button
            className="text-gray-600 hover:text-[#37B5FF] flex items-center space-x-2 mb-2 rounded-lg"
            onClick={resetFilters}
          >
            <FiRefreshCcw className="text-xl ms-4" />
            <span className="text-lg font-bold">Reset</span>
          </button>
        )}
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="p-4 bg-[#F9FAFB] rounded-lg shadow-md border border-[#E5E7EB]">
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* From Date */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
              <label className="flex items-center space-x-2 bg-white border border-[#E5E7EB] rounded-lg px-4 py-2">
                <span className="text-[#37B5FF] text-lg">📅</span>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) =>
                    setFilters({ ...filters, fromDate: e.target.value })
                  }
                  className="w-full text-md font-semibold text-gray-700 focus:outline-none placeholder-gray-500"
                  placeholder="From"
                />
              </label>
            </div>

            {/* To Date */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
              <label className="flex items-center space-x-2 bg-white border border-[#E5E7EB] rounded-lg px-4 py-2">
                <span className="text-[#37B5FF] text-lg">📅</span>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) =>
                    setFilters({ ...filters, toDate: e.target.value })
                  }
                  className="w-full text-md font-semibold text-gray-700 focus:outline-none placeholder-gray-500"
                  placeholder="To"
                />
              </label>
            </div>

            {/* Merchant */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
              <label className="flex items-center space-x-2 bg-white border border-[#E5E7EB] rounded-lg px-4 py-2">
                <span className="text-[#37B5FF] text-lg">📊</span>
                <input
                  type="text"
                  value={filters.merchant}
                  onChange={(e) =>
                    setFilters({ ...filters, merchant: e.target.value })
                  }
                  className="w-full text-md font-semibold text-gray-700 focus:outline-none placeholder-gray-500"
                  placeholder="Merchant"
                />
                <span className="text-gray-400">🔍</span>
              </label>
            </div>

            {/* Categories */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2 text-md font-semibold text-gray-700 focus:outline-none"
              >
                <option value="" className="font-semibold">
                  All categories
                </option>
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="font-semibold"
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseFilters;
