import React, { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import { FiChevronDown, FiFilter } from "react-icons/fi";
import {
  MdReceipt,
  MdReceiptLong,
  MdGridOn,
  MdDirectionsCar,
  MdLocationOn,
} from "react-icons/md";
import { FaBars } from "react-icons/fa";
import axios from "axios";
import { FaPencil } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/Loader/Loader";
import { fetchAllRules, createRule, updateRule, deleteRule } from "../../../Service/Api/api";


export default function ExpenseRules() {
  const { toggleSidebar } = useOutletContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManualModalOpen, setManualModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [formData, setFormData] = useState({
    merchant: "",
    category: "",
    description: "",
  });
  const [rules, setRules] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  // Fetch all rules on component mount
  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    // Simulate loading delay for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  const fetchRules = async () => {
    try {
      setIsLoading(true);
      const rulesData = await fetchAllRules();
      setRules(rulesData);
    } catch (error) {
      console.log("Error fetching rules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (isEditing) {
        await updateRule(editId, formData);
        setIsEditing(false);
        setEditId(null);
      } else {
        await createRule(formData);
      }
      setFormData({ merchant: "", category: "", description: "" });
      setIsModalOpen(false);
      fetchRules();
    } catch (error) {
      console.log("Error saving rule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (rule) => {
    setFormData({
      merchant: rule.merchant,
      category: rule.category,
      description: rule.description,
    });
    setEditId(rule._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await deleteRule(id);
      fetchRules();
    } catch (error) {
      console.log("Error deleting rule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col h-full bg-[#fffaf3]'>
      {/* Toast Container */}
      <ToastContainer />
      {/* Header Section */}
      <div className=" shadow-md p-4 flex justify-between items-center fixed top-0  w-full z-40 bg-white">
        {/* Sidebar Toggle Button for Small Screens */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-[#0B2838] text-2xl p-2 hover:bg-gray-100 rounded"
        >
          <FaBars />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0B2838]">Expense Rules</h1>
      </div>

      {/* Main Content */}
      <div className='mt-20 p-4'>
        {isLoading ? (
          <Loader />
        ) : (
          <div className='bg-[#fff] w-full sm:max-w-xl md:max-w-4xl lg:max-w-4xl xl:max-w-5xl mx-auto p-6 mt-6 rounded-lg shadow-[0_10px_20px_rgba(0,_0,_0,_0.2)]'>
            <h3 className='text-[#0B2838] text-[20px] mb-5 font-bold'>Expense Rules</h3>
            <p className='text-[#0B2838] text-1xl font-semibold mb-5 '>If you’re always expensing from the same merchant, create an Expense Rule. The rule will auto complete category, tag, and other changes to your future expenses with that merchant.</p>
            <button
              onClick={() => setIsModalOpen(true)} // Open modal on click
              className='bg-gradient-to-r from-[#0B2838] to-[#1a4459] hover:from-[#1a4459] hover:to-[#0B2838] transition-all duration-300 ease-in-out transform hover:scale-[1.02] text-white font-bold px-4 py-2 rounded text-[13px] flex items-center'
            >New Rule</button>

            {/* Rules Table */}
            {rules.map((rule) => (
              <table
                key={rule._id}
                className="w-full table-auto border-collapse border border-gray-300 mt-5"
              >
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold w-1/2">Merchant</td>
                    <td className="border border-gray-300 px-3 py-2 w-1/2">{rule.merchant}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold w-1/2">Category</td>
                    <td className="border border-gray-300 px-3 py-2 w-1/2">{rule.category}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold w-1/2">Description</td>
                    <td className="border border-gray-300 px-3 py-2 w-1/2">{rule.description}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold w-1/2">Action</td>
                    <td className="border border-gray-300 px-3 py-2 w-1/2 space-x-2">
                      <button
                        onClick={() => handleEdit(rule)}
                        className="rounded-md bg-[rgb(238,235,231)] px-2 py-2 text-[#002E22]"
                      >
                        <FaPencil />
                      </button>
                      <button
                        onClick={() => handleDelete(rule._id)}
                        className="rounded-md bg-red-500 px-2 py-2 text-white"
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            ))}
          </div>
        )}
        
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-2 bg-black bg-opacity-50 shadow-lg">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-xl font-bold">
                  {isEditing ? "Edit Rule" : "Add Rule"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-800 hover:text-gray-800 focus:outline-none text-md font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-6 py-2">
                <div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">
                        Merchant
                      </label>
                      <input
                        type="text"
                        name="merchant"
                        value={formData.merchant}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-md bg-gradient-to-r from-[#0B2838] to-[#1a4459] hover:from-[#1a4459] hover:to-[#0B2838] transition-all duration-300 ease-in-out transform hover:scale-[1.02] px-4 py-2 text-sm text-white"
                >
                  Save Rule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
