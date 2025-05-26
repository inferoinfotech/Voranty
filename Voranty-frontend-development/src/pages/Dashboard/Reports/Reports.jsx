import React, { useEffect } from 'react';
import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Star, Search, Check } from 'lucide-react';
import { useOutletContext } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FiFilter, FiRefreshCcw } from 'react-icons/fi';
import { MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import expensesImage from "../../../assets/images/background/expenses.svg";
import axios from 'axios';
import Loader from "@/components/Loader/Loader";
import ExpenseFilters from '@/components/ExpenseFilters/ExpenseFilters';
import { fetchAllReports } from '@/Service/Api/api';
import NoContent from '@/components/NoContentScreen/noContentScreen';
import { saveAs } from "file-saver";
const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Reports() {
  const { toggleSidebar } = useOutletContext();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    invoice: "",
    category: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const handleExport = async (type) => {
    if (selectedExpenses.length === 0) {
      console.warn("No expenses selected for export.");
      return;
    }
  
    if (type === "default") {
      try {
        const response = await axios.post(
          `${baseUrl}/users/export-csv`, 
          { expenseIds: selectedExpenses },
          {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "blob", 
          }
        );
  
        const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "expenses.csv");
      } catch (error) {
        console.log("Error exporting CSV:", error);
      }
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedExpenses(!selectAll ? filteredExpenses.map((expense) => expense._id) : []);
  };


  const handleSelectRow = (id) => {
    setSelectedExpenses((prev) =>
      prev.includes(id) ? prev.filter((expenseId) => expenseId !== id) : [...prev, id]
    );
  };

  const handleRowClick = (id) => {
    navigate(`/reportdetails/${id}`);
  };

  const resetFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      invoice: "",
      category: "",
    });
  };

  // useEffect(() => {
  //   const fetchExpenses = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await axios.get("https://h5rk5mqk-8080.inc1.devtunnels.ms/users/allget", {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //         },
  //       });
  //       setExpenses(response.data);
  //       console.log("Expenses:", response.data);
  //       setFilteredExpenses(response.data);
  //     } catch (error) {
  //       console.log("Failed to fetch expenses:", error);
  //     } finally {
  //       setIsLoading(false); // Set loading state to false after fetching
  //     }
  //   };

  //   fetchExpenses();
  // }, []);
  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllReports();
        setExpenses(data);
        // console.log("Reports:", data);
      } catch (error) {
        console.log("Error fetching reports:", error);
        toast.error("Error loading reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  useEffect(() => {
    const normalizeDate = (date) => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    const filtered = expenses.filter((expense) => {
      const expenseDate = expense.Title ? normalizeDate(expense.Title) : null;
      const fromDate = filters.fromDate ? normalizeDate(filters.fromDate) : null;
      const toDate = filters.toDate ? normalizeDate(filters.toDate) : null;

      // Filter by date range
      if (fromDate && expenseDate && expenseDate < fromDate) return false;
      if (toDate && expenseDate && expenseDate > toDate) return false;

      // Filter by invoice text
      if (
        filters.invoice &&
        (!expense.invoice || !expense.invoice.toLowerCase().includes(filters.invoice.toLowerCase().trim()))
      ) {
        return false;
      }

      // Filter by category
      if (filters.category && expense.Category !== filters.category) {
        return false;
      }

      return true;
    });

    setFilteredExpenses(filtered);
  }, [filters, expenses]);

  // Get unique categories for the filter dropdown
  const categories = [...new Set(expenses.map((expense) => expense.Category))];

  return (
    <div className="flex flex-col min-h-screen bg-[#fffaf3] w-full ">
      <div className="shadow-md p-4 flex justify-between items-center fixed top-0 right-0 left-0 sm:left-0  xl:left-[260px] z-40 bg-white">
        {/* Sidebar Toggle Button for Small Screens */}
        <button
          onClick={toggleSidebar}
          className="xl:hidden text-[#0B2838] text-2xl p-2 hover:bg-gray-100 rounded"
        >
          <FaBars />
        </button>
        <h1 className="text-xl md:text-3xl font-bold text-[#0B2838] ">
          Reports
        </h1>
        <div>
            <button
            className={`bg-[#F5F3EF] text-black font-medium px-2 md:px-4 md:py-1  border-2 rounded-full transition ${selectedExpenses.length > 0
              ? "hover:bg-[#e2e1da] cursor-pointer font-bold border-4"
              : "opacity-50 cursor-not-allowed"
              }`}
            disabled={selectedExpenses.length === 0} // Disable if no rows are selected
            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
          >
            <p className='flex'> Export to <span className='mt-1 ms-1 text-lg'> <MdKeyboardArrowDown /> </span>  </p>

          </button> 
          {isExportDropdownOpen && (
            <div className="absolute mt-2 w-60 md:w-64 px-2 py-2 mr-4 text-md right-0 bg-white shadow-lg rounded-lg z-10 border border-gray-200">
              <div className="">
                <button
                  className="w-full flex items-center py-2 ps-2 hover:bg-gray-100 rounded"
                  onClick={() => {
                    handleExport("default");
                    setIsExportDropdownOpen(false);
                  }}
                >
                  <img
                    src="../../../src/assets/images/cover/csv.png"
                    alt="CSV Icon"
                    className="h-8 w-8 mr-2"
                  />
                  <span className="text-sm md:text-md font-bold px-1">
                    Default CSV
                  </span>
                </button>
                {/* <button
                  className="w-full flex items-center py-3 ps-2 hover:bg-gray-100 rounded"
                  onClick={() => {
                    handleExport("default");
                    setIsExportDropdownOpen(false);
                  }}
                >
                  <span className="text-sm md:text-md font-bold px-1">
                    Create New CSV Export Layout
                  </span>
                </button> */}
              </div>
            </div>
          )} 
        </div>
      </div>

      {/* Replace the old filters section with ExpenseFilters component */}
      <ExpenseFilters 
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        categories={categories}
      />

      {/* Main Content */}
      <div className="">
        {isLoading ? ( // Check if data is loading
          <div >
            <Loader />
          </div>

        ) : filteredExpenses.length > 0 ? (
          <div className="font-[Poppins] p-6 space-y-6">
            {/* Header Row */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="cursor-pointer h-4 w-4 rounded border-2 "
                style={{
                  accentColor: "#0b2838cb",
                }}
              />
              <label className="text-gray-800 text-lg font-medium">
                Select All
              </label>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="bg-white rounded-lg hover:shadow-2xl transition-all duration-300 cursor-pointer "
                  onClick={() => handleRowClick(expense._id)}
                >
                  {/* Card Header */}
                  <div className='border-none'>  
                  <div className="p-3  bg-gradient-to-r from-[#0B2838] to-[#1a4459] rounded-t-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedExpenses.includes(expense._id)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleSelectRow(expense._id)}
                          className="cursor-pointer h-4 w-4"
                          style={{ accentColor: "white" }}
                        />
                        <h3 className="font-semibold text-white text-xl">Invoice {expense.Title}</h3>
                      </div>
                      <span className="px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm text-white rounded-full">
                        {expense.Category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className='bg-gray-100 rounded-lg p-3'>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(expense.Title).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className='bg-gray-100 rounded-lg p-3'>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium text-gray-800">₹{expense.Total_Ammount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {expense.imageUrl && (
                      <div className="mt-4">
                        <div className="h-20 w-20 rounded-lg overflow-hidden  ">
                          <img
                            src={expense.imageUrl}
                            alt="Receipt"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <NoContent/>
        )}
      </div>
    </div>
  );
}
