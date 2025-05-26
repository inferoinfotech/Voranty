import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { MdReceipt, MdReceiptLong, MdGridOn } from "react-icons/md";
import { FaBars, FaTrashAlt } from "react-icons/fa";
import ExpenseModal from "./ExpenseModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExpensesEdit from "./ExpensesEdit";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import ExpenseCard from '@/components/Cards/ExpenseCard/ExpenseCard';
import ExpenseFilters from '@/components/ExpenseFilters/ExpenseFilters';
import { fetchAllExpenses, updateExpense, deleteExpense, deleteMultipleExpenses, fetchExpenseById } from '@/Service/Api/api';
import NoContent from "@/components/NoContentScreen/noContentScreen";
import ScanReceiptModal from './ScanReceiptModal';
import FileUploadModal from './FileUploadModal';
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_BASE_URL;

const Expenses = () => {
  const { toggleSidebar } = useOutletContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManualModalOpen, setManualModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("Expense");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanningReceipt, setIsScanningReceipt] = useState(false);
  
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [imgerror, imgsetError] = useState("");
  const [data, setData] = useState(null);

  const handleImageUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setFile(uploadedFile);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };


  const [aiformData, aisetFormData] = useState({
    merchant: "",
    amount: "",
    date: "",
    warrentyDate: "",
    description: "",
    category: "",
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setError("");
    setData(null);
    setImagePreview(null);
    setFile(null);
  };

  const handleSave = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("bill", file);

    try {
      setIsScanningReceipt(true);
      const response = await axios.post(`${baseUrl}/ai/scan-bill`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      

      const { analysis } = response.data;

      const requiredKeys = [
        "merchant",
        "amount",
        "date",
        "warrantyDate",
        "description",
        "category",
      ];

      const isValidData = requiredKeys.every((key) => key in response.data.data);
      if (isValidData) {
        setIsModalOpen(false);
        setModalTab("Expense");
        setModalOpen(true);

        const extractedData = {
          ...response,
          imageFile: file,
          imagePreview: imagePreview
        };
        setData(extractedData);
      } else {
        setError("Extracted data does not match the required format.");
        setData(null);
      }
    } catch (error) {
      console.log("Error analyzing image:", error);
    
      setData(null);
    } finally {
      setIsScanningReceipt(false);
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (tab) => {
    setModalTab(tab);
    setModalOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);



  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    merchant: "",
    category: "",
  });

  const resetFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      merchant: "",
      category: "",
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedExpenses(expenses.map((expense) => expense._id));
    } else {
      setSelectedExpenses([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedExpenses.includes(id)) {
      setSelectedExpenses(
        selectedExpenses.filter((expenseId) => expenseId !== id)
      );
    } else {
      setSelectedExpenses([...selectedExpenses, id]);
    }
  };

  const onClose = () => {
    setShowModal(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openManualModal = () => {
    setManualModalOpen(true);
  };

  const closeManualModal = () => {
    setManualModalOpen(false);
  };
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.log("File input is not available.");
    }
  };

  

  const handleExpenseClick = (id) => {
    setSelectedExpenseId(id);
    setShowModal(true);
  };

  const [formData, setFormData] = useState({
    merchant: "",
    date: "",
    warrentyDate: "",
    amount: "",
    reimbursable: false,
    category: "",
    description: "",
    imageUrl: "",
  });

  

  useEffect(() => {
    async function fetchExpense() {
      try {
        setIsLoading(true);
        const expense = await fetchExpenseById(selectedExpenseId);
     

        setFormData({
          merchant: expense.merchant || "",
          date: expense.date
            ? new Date(expense.date).toISOString().split("T")[0]
            : "",
          warrentyDate: expense.warrentyDate
            ? new Date(expense.warrentyDate).toISOString().split("T")[0]
            : "",
          amount: expense.amount || "",
          reimbursable: expense.reimbursable || false,
          category: expense.category || "",
          description: expense.description || "",
          imageUrl: expense.imageUrl || "",
        });
      } catch (error) {
        console.log("Error fetching expense:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedExpenseId) {
      fetchExpense();
    }
  }, [selectedExpenseId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateExpense(selectedExpenseId, formData);
      await fetchExpenses();
    } catch (error) {
      console.log("Error updating expense:", error.message);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  // Delete Expense
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteExpense(selectedExpenseId);
        await fetchExpenses(); 
    } catch (error) {
      console.log("Error deleting expense:", error.message);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const expenses = await fetchAllExpenses();
      
      
      setExpenses(expenses);
      setFilteredExpenses(expenses);
    } catch (error) {
      console.log("Error fetching expenses:", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const filterExpenses = () => {
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
      const toDate = filters.toDate ? new Date(filters.toDate) : null;

      if (fromDate && toDate) {
        if (expenseDate < fromDate || expenseDate > toDate) return false;
      } else if (fromDate && expenseDate < fromDate) {
        return false;
      } else if (toDate && expenseDate > toDate) {
        return false;
      }

      if (
        filters.merchant &&
        !expense.merchant.toLowerCase().includes(filters.merchant.toLowerCase())
      ) {
        return false;
      } if (filters.category && expense.category !== filters.category) {
        return false;
      }
      return true;
    });
    setFilteredExpenses(filtered);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = () => {
    fetchExpenses()
  }

  useEffect(() => {
    filterExpenses();
  }, [filters, expenses]);

  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem("expenseCategories");
    return savedCategories ? JSON.parse(savedCategories) : [];
  });

  const deleteSelectedExpenses = async () => {
    if (selectedExpenses.length === 0) return;
    try {
      await deleteMultipleExpenses(selectedExpenses);
      setExpenses(expenses.filter(expense => !selectedExpenses.includes(expense._id)));
      setSelectedExpenses([]);
    } catch (error) {
      console.log("Error deleting expenses:", error.message);
    }
  };

  useEffect(() => {
    const uniqueCategories = [
      ...new Set(expenses.map((expense) => expense.category)),
    ];
    setCategories(uniqueCategories);
    localStorage.setItem("expenseCategories", JSON.stringify(uniqueCategories));
  }, [expenses]);

  

  const [files, setFiles] = useState(null);

  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; 
    setFiles(selectedFile); 
  };
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async () => {
    if (!files) {
      toast.error("Please select a file to upload", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      return;
    }

    const formData = new FormData();
    formData.append("csvFiles", files);

    try {
      setIsUploading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${baseUrl}/users/importExpense`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setIsFileModalOpen(false);
      toast.success("Expense Created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      // Refresh expenses list after successful upload
      await fetchExpenses();
    } catch (error) {
      console.log("Error uploading file:", error.message);
      toast.error(error.response?.data?.message || "Error uploading file", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#fffaf3]">
        {/* Header Section */}
        <div className="shadow-md p-4 flex justify-between items-center fixed top-0 right-0 left-0 sm:left-0 xl:left-[260px] z-40 bg-white">
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
                <FiChevronDown
                  className={`ml-2 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
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
                      <span className="text-lg font-semibold">
                        Manually Create
                      </span>
                    </button>
                    <div>
                      <button
                        className="w-full flex items-center py-2 ps-2 hover:bg-gray-100 rounded"
                        onClick={toggleModal}
                      >
                        <MdReceiptLong className="text-[#0B2838] mr-3 text-lg" />
                        <span className="text-lg font-semibold">
                          Scan Receipt
                        </span>
                      </button>

                      {/* Modal */}
                      <ScanReceiptModal 
                        isOpen={isModalOpen}
                        onClose={toggleModal}
                        imagePreview={imagePreview}
                        handleImageUpload={handleImageUpload}
                        handleSave={handleSave}
                        error={error}
                        isScanningReceipt={isScanningReceipt}
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
                      <span className="text-lg font-semibold">
                        Create Multiple
                      </span>
                    </button>
                    <button
                      onClick={() => setIsFileModalOpen(true)}
                      className="w-full flex items-center py-2 ps-2 hover:bg-gray-100 rounded"
                    >
                      <MdReceiptLong className="text-[#0B2838] mr-3 text-lg" />
                      <span className="text-lg font-semibold">Import CSV</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Delete Button */}
            <button
              className={`bg-red-600 text-white px-4 py-2 rounded  items-center  transition duration-300 ${selectedExpenses.length > 0
                ? "hover:bg-red-700 cursor-pointer"
                : "opacity-50 cursor-not-allowed "
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

        {/* Replace the old filters section with the new component */}
        <ExpenseFilters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          categories={categories}
        />

        {/* Main Content */}
        <div className="mb-8">
          {isLoading ? ( 
            <div >
              <Loader />
            </div>
          ) : filteredExpenses.length > 0 ? (
            <div className="font-[Poppins] px-6 py-2 space-y-6">
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
                  <ExpenseCard
                    key={expense._id}
                    expense={expense}
                    isSelected={selectedExpenses.includes(expense._id)}
                    onSelect={handleSelectRow}
                    onCardClick={handleExpenseClick}
                  />
                ))}
              </div>
            </div>
          ) : (
            <NoContent />
          )}
        </div>

        {/* Expense Modal */}
        <ExpenseModal
          defaultTab={modalTab}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          handleAdd={handleAddExpense}
          extractedData={data}
        />
        <ExpensesEdit
          showModal={showModal}
          onClose={onClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
        />
      </div>

      <div>
        <ToastContainer />
      </div>

      <FileUploadModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        handleFileChange={handleFileChange}
        handleFileUpload={handleFileUpload}
        selectedFile={files}
        isUploading={isUploading}
      />
    </>
  );
};

export default Expenses;