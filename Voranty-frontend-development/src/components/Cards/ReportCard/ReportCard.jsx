import React, { useEffect } from 'react';
import { calculateDaysAgo } from './dateUtil';
import Loader from "@/components/Loader/Loader";
import { useState } from 'react';


const ReportCard = ({
  rules,
  messages,
  inputValue,
  setInputValue,
  handleSend
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg">
      {isLoading ? (
        // Show Loader when loading
        <div>
          <Loader />
        </div>
      ) : (
        // Main Content when not loading
        <>
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#0B2838] to-[#1a4459] text-white p-6 rounded-t-lg">
            <h1 className="text-2xl md:text-2xl font-bold">Expense Report</h1>
            <p className="mt-2 text-sm md:text-md font-semibold">
              Report for <span className="font-semibold">
                {new Date(rules.Title).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>

          {/* Main Content Section */}
          <div className="p-6 space-y-6">

            {/* Overview */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="font-bold text-gray-800">Created Date</h2>
                <p className="text-gray-600 font-semibold">
                  {new Date(rules.Title).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Total Amount</h2>
                <p className="text-gray-600 font-semibold">
                  {rules.Expense
                    ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "INR",
                    }).format(rules.Expense.amount)
                    : "--"}
                </p>
              </div>
            </div>

            {/* Expense Details */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                Expense Details
              </h2>
              {rules.Expense ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-md shadow-sm">
                    <h3 className="font-bold text-gray-800">Date</h3>
                    <p className="text-gray-600 font-semibold">
                      {new Date(rules.Expense.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md shadow-sm">
                    <h3 className="font-bold text-gray-800">Merchant</h3>
                    <p className="text-gray-600 font-semibold">
                      {rules.Expense.merchant}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md shadow-sm">
                    <h3 className="font-bold text-gray-800">Due Date</h3>
                    <p className="text-gray-600 font-semibold">
                    {rules.Expense.warrentyDate 
                    ? new Date(rules.Expense.warrentyDate).toLocaleDateString('en-GB') 
                    : ''}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md shadow-sm">
                    <h3 className="font-bold text-gray-800">Category</h3>
                    <p className="text-gray-600 font-semibold">
                      {rules.Expense.category}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md shadow-sm col-span-1 md:col-span-2">
                    <h3 className="font-bold text-gray-800">Description</h3>
                    <p className="text-gray-600 font-semibold">
                      {rules.Expense.description}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No expense data available
                </p>
              )}
            </div>

            {/* Messages */}
            <div className="border-t pt-4 h-32 overflow-y-auto sr">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Activity Log
              </h2>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li key="system-message">
                  <span className="font-semibold">
                    {calculateDaysAgo(rules.createdAt)}:
                  </span>{" "}
                  You created this report
                </li>
                {messages.map((message, index) => (
                  <li key={`message-${message.id || index}`}>
                    <span className="font-semibold">{message.time}:</span>{" "}
                    {message.text}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Footer Section */}
          <div className="bg-gray-100 p-6 rounded-b-lg">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
              <input
                type="text"
                placeholder="Add a comment..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-gradient-to-r from-[#0B2838] to-[#1a4459] hover:from-[#1a4459] hover:to-[#0B2838] transition-all duration-300 ease-in-out transform hover:scale-[1.02] text-white font-semibold rounded-md focus:ring-2 focus:ring-blue-300"
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportCard;