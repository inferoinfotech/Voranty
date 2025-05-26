import React from 'react';
import { FaBars, FaTrashAlt } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { MdReceipt, MdReceiptLong, MdGridOn } from "react-icons/md";

const ExpenseHeader = ({ 
  toggleSidebar, 
  isDropdownOpen, 
  setIsDropdownOpen, 
  openModal, 
  handleButtonClick, 
  handleFileChange, 
  fileInputRef,
  selectedExpenses,
  deleteSelectedExpenses 
}) => {
  return (
    <div className="shadow-md p-3 flex justify-between items-center fixed top-0 right-0 left-0 sm:left-0 xl:left-[260px] z-40 bg-white">
      <button
        onClick={toggleSidebar}
        className="xl:hidden text-[#0B2838] text-2xl p-2 hover:bg-gray-100 rounded"
      >
        <FaBars />
      </button>

      <h1 className="text-xl md:text-3xl font-bold text-[#0B2838]">
        Expenses
      </h1>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            className="bg-gradient-to-r from-[#0B2838] to-[#1a4459] hover:from-[#1a4459] hover:to-[#0B2838] transition-all duration-300 ease-in-out transform hover:scale-[1.02] text-white px-2 text-sm font-semibold lg:text-md xl:text-lg lg:px-4 pb-2 pt-1 rounded  flex items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            New Expense
            <FiChevronDown className={`ml-2 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute mt-2 w-60 right-0 bg-white shadow-lg rounded-lg z-10 border border-gray-200">
              <div className="px-2 py-2">
                <h6 className="text-gray-500 text-md ps-3 font-semibold mb-2">
                  EXPENSE
                </h6>
                <button
                  className="w-full flex items-center py-2 ps-2 hover:bg-gray-100 rounded"
                  onClick={() => {
                    openModal("Expense");
                    setIsDropdownOpen(false);
                  }}
                >
                  <MdReceipt className="text-[#0B2838] mr-3 text-lg" />
                  <span className="text-lg font-semibold">Manually Create</span>
                </button>
                <div>
                  <button
                    className="w-full flex items-center py-2 ps-2 hover:bg-gray-100 rounded"
                    onClick={() => {
                      handleButtonClick();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <MdReceiptLong className="text-[#0B2838] mr-3 text-lg" />
                    <span className="text-lg font-semibold">Scan Receipt</span>
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept='.jpg, .jpeg, .png, .pdf'
                    onChange={(e) => {
                      handleFileChange(e);
                      setIsDropdownOpen(false);
                    }}
                    className="hidden"
                  />
                </div>
                <button
                  className="w-full flex items-center py-2 ps-2 hover:bg-gray-100 rounded"
                  onClick={() => {
                    openModal("Multiple");
                    setIsDropdownOpen(false);
                  }}
                >
                  <MdGridOn className="text-[#0B2838] mr-3 text-lg" />
                  <span className="text-lg font-semibold">Create Multiple</span>
                </button>
                {/* <button
                  className="w-full flex items-center py-2 ps-2 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setIsDropdownOpen(false);
                  }}
                >
                  <img
                    src="../../../src/assets/images/cover/csv.png"
                    alt="CSV Icon"
                    className="h-6 w- mr-2"
                  />
                  <span className="text-lg font-semibold">Import CSV</span>
                </button> */}
              </div>
            </div>
          )}
        </div>

        <button
          className={`bg-red-600 text-white px-4 py-2 rounded items-center transition duration-300 ${
            selectedExpenses.length > 0
              ? "hover:bg-red-700 cursor-pointer"
              : "opacity-50 cursor-not-allowed"
          }`}
          onClick={deleteSelectedExpenses}
          disabled={selectedExpenses.length === 0}
          style={{
            display: selectedExpenses.length > 0 ? "inline-flex" : "none",
          }}
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default ExpenseHeader;