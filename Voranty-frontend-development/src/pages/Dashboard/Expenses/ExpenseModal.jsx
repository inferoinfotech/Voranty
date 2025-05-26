import React, { useState, useRef, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createExpense, createMultipleExpenses } from "@/Service/Api/api";
import emptyImage from '../../../assets/images/background/emptyImage.svg';
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { MdOutlineCategory } from "react-icons/md";
import { CiMoneyCheck1 } from "react-icons/ci";


const ExpenseModal = ({ defaultTab = "Expense", isOpen, onClose, handleAdd, extractedData }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);


  const [formData, setFormData] = useState({
    merchant: "",
    amount: "",
    date: "",
    warrentyDate: "",
    description: "",
    category: "",
    reimbursable: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);




  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const expenseData = {
        merchant: formData.merchant,
        amount: formData.amount,
        date: formData.date,
        warrentyDate: formData.warrentyDate,
        description: formData.description,
        category: formData.category,
        reimbursable: formData.reimbursable,
      };

      setLoading(true);
      await createExpense(expenseData, file);

      // Reset form and file
      setFormData({
        merchant: "",
        amount: "",
        date: "",
        warrentyDate: "",
        description: "",
        category: "",
        reimbursable: false,
      });
      setFile(null);

      // Call handleAdd first
      handleAdd();

      // Close modal after toast animation completes
      toast.success("Expense created successfully!", {
        onClose: () => {
          onClose();
        },
        autoClose: 2000
      });
      
    } catch (error) {
      console.log("Error handling single expense submission:", error);
    } finally {
      setLoading(false);
    }
  };


  const [multipleFormData, setMultipleFormData] = useState([
    {
      date: "",
      warrentyDate: "",
      merchant: "",
      total: "",
      category: "",
      description: "",
      file: null,
    },
  ]);

  const handleMultipleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedData = [...multipleFormData];
    updatedData[index][name] = value;
    setMultipleFormData(updatedData);
  };



  const addRow = () => {
    setMultipleFormData([
      ...multipleFormData,
      {
        date: "",
        warrentyDate: "",
        merchant: "",
        total: "",
        category: "",
        description: "",
        file: null,
      },
    ]);
  };

  const removeRow = (index) => {
    const updatedData = multipleFormData.filter((_, i) => i !== index);
    setMultipleFormData(updatedData);
  };



  const handleMultipleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      setLoading(true);
      await createMultipleExpenses(multipleFormData);

      // Reset form data and file previews after successful submission
      setMultipleFormData([
        {
          date: "",
          warrentyDate: "",
          merchant: "",
          total: "",
          category: "",
          description: "",
          file: null,
        },
      ]);
      setPreviewImages({});

      // Additional actions like closing modal
      handleAdd();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.log("Error handling multiple expense submission:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const [previewImages, setPreviewImages] = useState({});

  const handleMultipleFileChange = (e, index) => {
    const file = e.target.files[0];

    if (file) {
      const previewUrl = URL.createObjectURL(file);

      setPreviewImages((prev) => ({
        ...prev,
        [index]: previewUrl,
      }));

      setMultipleFormData((prev) =>
        prev.map((data, i) => (i === index ? { ...data, file } : data))
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    if (extractedData) {
      setFormData({
        merchant: extractedData.data.data.merchant || '',
        amount: extractedData.data.data.amount || '',
        date: extractedData.data.data.date || '',
        warrentyDate: extractedData.data.data.warrentyDate || '',
        description: extractedData.data.data.description || '',
        category: extractedData.data.data.category || '',
        // If you need to handle the image:
        // imageFile: extractedData.imageFile || null,
        // imagePreview: extractedData.imagePreview || null
      });
    }
  }, [extractedData]);

  // console.log("extractedData", extractedData);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-5xl relative animate-fadeIn m-4 flex flex-col max-h-[90vh]">
          {/* Fixed Header */}
          <div className="p-7 border-b border-gray-100/50">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0B2838] via-[#1a4459] to-[#2d6070] bg-clip-text text-transparent">
                  New Expense
                </h2>
                <p className="text-gray-500 mt-1 text-sm tracking-wide">
                  Fill in the details below to create a new expense record
                </p>
              </div>
              <button
                onClick={onClose}
                className="group p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-300"
              >
                <MdClose className="text-2xl text-gray-400 group-hover:text-gray-600 group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-8 mt-8">
              {['Expense', 'Multiple'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-4 px-4 font-medium text-lg transition-all duration-300 
                    ${activeTab === tab
                      ? "text-[#0B2838] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#0B2838] after:to-[#1a4459] after:rounded-full"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {tab === 'Expense' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    )}
                    {tab === 'Expense' ? 'Single Expense' : 'Multiple Expenses'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-scroll p-7 pt-4 sr">
            {activeTab === "Expense" && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
                  {/* Left Section - Form Fields */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Form Fields Section */}
                    <div className="space-y-6">
                      {/* Merchant Row */}
                      <div className="space-y-2">
                        <label className="block text-gray-700 font-medium">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Merchant<span className="text-red-400">*</span>
                          </div>
                        </label>
                        <input
                          type="text"
                          name="merchant"
                          value={formData.merchant}
                          onChange={handleInputChange}
                          placeholder="Enter merchant name"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all placeholder:text-gray-300 hover:border-gray-300"
                        />
                      </div>

                      {/* Date Row */}
                      <div className="space-y-2">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 0v4M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Date <span className="text-red-400">*</span>
                              </div>
                            </label>
                            <input
                              type="date"
                              name="date"
                              value={formData.date}
                              onChange={handleInputChange}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all hover:border-gray-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 0v4M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Warranty Date
                              </div>
                            </label>
                            <input
                              type="date"
                              name="warrentyDate"
                              value={formData.warrentyDate}
                              onChange={handleInputChange}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all hover:border-gray-300"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Amount & Category */}
                      <div className="space-y-2">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="relative">
                              <label className="text-gray-700 font-medium flex items-center gap-2 mb-2">
                                <CiMoneyCheck1 className="w-5 h-5 text-gray-400" />
                                Amount <span className="text-red-400">*</span>
                              </label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                <input
                                  type="number"
                                  name="amount"
                                  value={formData.amount}
                                  onChange={handleInputChange}
                                  placeholder="0.00"
                                  className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all placeholder:text-gray-300 hover:border-gray-300"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="relative">
                              <label className="text-gray-700 font-medium flex items-center gap-2 mb-2">
                                <MdOutlineCategory className="w-5 h-5 text-gray-400"/>
                                Category <span className="text-red-400">*</span>
                              </label>
                              <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                placeholder="Enter category"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all placeholder:text-gray-300 hover:border-gray-300"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-gray-700 font-medium flex items-center gap-2 ">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter description"
                          rows="3"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all resize-none placeholder:text-gray-300 hover:border-gray-300"
                        ></textarea>
                      </div>

                      {/* Reimbursable Toggle */}
                      <div className="flex items-center gap-3">
                        <label className="text-gray-700 font-medium flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Reimbursable
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="reimbursable"
                            checked={formData.reimbursable}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0B2838] peer-checked:to-[#1a4459]"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Right Section - File Upload */}
                  <div className="col-span-1">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 h-full flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-100/50 transition-all group relative overflow-hidden">
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="fileInput"
                        className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center relative z-10"
                      >
                        {file ? (
                          <div className="relative w-full h-full">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="w-full h-full object-contain rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <div className="text-white text-center">
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <p>Click to change</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="relative">
                              <img
                                src={emptyImage}
                                alt="Upload"
                                className="w-24 h-24 mx-auto mb-4 opacity-40 group-hover:opacity-60 transition-opacity"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                              </div>
                            </div>
                            <p className="text-gray-600 font-medium">Drop files here or click to upload</p>
                            <p className="text-gray-400 text-sm mt-2">Supported formats: JPG, PNG, PDF</p>
                            <p className="text-gray-400 text-sm">Max size: 5MB</p>
                          </>
                        )}
                      </label>
                      {/* Animated Background Pattern */}
                      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-transparent to-gray-200"></div>
                        <div className="absolute inset-0" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Submit Button */}
                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group bg-gradient-to-r from-[#0B2838] via-[#1a4459] to-[#2d6070] hover:from-[#2d6070] hover:via-[#1a4459] hover:to-[#0B2838] text-white px-8 py-3 rounded-xl font-medium transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl relative overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center gap-3">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Expense</span>
                          <svg
                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </div>
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                </div>
              </form>
            )}

            {activeTab === "Multiple" && (
              <form onSubmit={handleMultipleSubmit} className="space-y-6">
                <div className="overflow-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#0B2838] to-[#1a4459] text-white">
                        {['Date', 'Warranty', 'Merchant', 'Amount', 'Receipt', 'Category', 'Description', 'Action'].map((header) => (
                          <th key={header} className="px-4 py-4 text-left text-sm font-bold text-white first:pl-6 last:pr-6">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {multipleFormData.map((data, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-4 first:pl-6">
                            <input
                              type="date"
                              name="date"
                              value={data.date}
                              onChange={(e) => handleMultipleInputChange(e, index)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="date"
                              name="warrentyDate"
                              value={data.warrentyDate}
                              onChange={(e) => handleMultipleInputChange(e, index)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="text"
                              name="merchant"
                              placeholder="Merchant"
                              value={data.merchant}
                              onChange={(e) => handleMultipleInputChange(e, index)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="number"
                              name="total"
                              placeholder="0.00"
                              value={data.total}
                              onChange={(e) => handleMultipleInputChange(e, index)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <label
                              htmlFor={`file-upload-${index}`}
                              className="cursor-pointer flex items-center justify-center"
                            >
                              {previewImages[index] ? (
                                <img
                                  src={previewImages[index]}
                                  alt="Preview"
                                  className="w-16 h-16 object-contain border rounded"
                                />
                              ) : (
                                <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded">
                                  <span className="text-gray-500 text-sm font-semibold">?</span>
                                </div>
                              )}
                            </label>
                            <input
                              id={`file-upload-${index}`}
                              type="file"
                              accept=".jpg, .jpeg, .png"
                              className="hidden"
                              onChange={(e) => handleMultipleFileChange(e, index)}
                            />
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="text"
                              name="category"
                              placeholder="Category"
                              value={data.category}
                              onChange={(e) => handleMultipleInputChange(e, index)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="text"
                              name="description"
                              placeholder="Description"
                              value={data.description}
                              onChange={(e) => handleMultipleInputChange(e, index)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              className="text-red-500 bg-red-100 border border-red-500 px-2 py-1 rounded"
                              onClick={() => removeRow(index)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Enhanced Actions */}
                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={addRow}
                    className="group flex items-center gap-2 px-6 py-3 border-2 border-[#0B2838] text-[#0B2838] rounded-xl hover:bg-[#0B2838] hover:text-white transition-all duration-300"
                  >
                    <svg className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Row
                  </button>

                  <button
                    type="submit"
                    disabled={multipleFormData.length < 2 || loading}
                    className="group bg-gradient-to-r from-[#0B2838] to-[#1a4459] hover:from-[#1a4459] hover:to-[#0B2838] text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Save All</span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ExpenseModal;