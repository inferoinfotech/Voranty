import React from "react";
import { MdClose } from "react-icons/md";
import { FiTrash } from "react-icons/fi";
import edit_image from "../../../assets/images/background/edit_image.svg";
import { CiMoneyCheck1 } from "react-icons/ci";
import { MdOutlineCategory } from "react-icons/md";


const ExpensesEdit = ({ showModal, onClose, formData, handleInputChange, handleSubmit, handleDelete }) => {


    const handleImageChange = (e) => {
        const file = e.target.files[0]; 
        if (file) {
            const imageUrl = URL.createObjectURL(file);

            handleInputChange({
                target: { name: 'imageUrl', value: imageUrl },
            });
        }
    };


    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-5xl relative animate-fadeIn m-4 flex flex-col max-h-[90vh]">
                {/* Fixed Header */}
                <div className="p-7 border-b border-gray-100/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0B2838] via-[#1a4459] to-[#2d6070] bg-clip-text text-transparent">
                                Edit Expense
                            </h2>
                            <p className="text-gray-500 mt-1 text-sm tracking-wide">
                                Update the expense details below
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="group p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-300"
                        >
                            <MdClose className="text-2xl text-gray-400 group-hover:text-gray-600 group-hover:rotate-90 transition-all duration-300" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-7 pt-4 sr">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
                            {/* Left Section - Form Fields */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Merchant */}
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
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all placeholder:text-gray-300 hover:border-gray-300"
                                    />
                                </div>

                                {/* Date and Warranty Date */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 0v4M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Date<span className="text-red-400">*</span>
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

                                {/* Amount and Category */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CiMoneyCheck1 className="w-5 h-5 text-gray-400" />
                                                Amount<span className="text-red-400">*</span>
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                            <input
                                                type="text"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all hover:border-gray-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MdOutlineCategory className="w-5 h-5 text-gray-400" />
                                                Category
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all hover:border-gray-300"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                            </svg>
                                            Description
                                        </div>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0B2838]/20 focus:border-[#0B2838] outline-none transition-all resize-none hover:border-gray-300"
                                    ></textarea>
                                </div>

                                {/* Reimbursable */}
                                <div className="flex items-center gap-3">
                                    <label className="text-gray-700 font-medium flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                            {/* Right Section - Image Upload */}
                            <div className="col-span-1">
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 h-full flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-100/50 transition-all group relative overflow-hidden">
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="fileInput"
                                        className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center"
                                    >
                                        <img
                                            src={formData.imageUrl || edit_image}
                                            alt="Upload"
                                            className="w-32 h-32 object-contain mb-4"
                                        />
                                        <p className="text-gray-600 font-medium">Drop files here or click to upload</p>
                                        <p className="text-gray-400 text-sm mt-2">Supported formats: JPG, PNG, PDF</p>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                            <button
                                onClick={handleDelete}
                                type="button"
                                className="group flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300"
                            >
                                <FiTrash className="w-5 h-5" />
                                <span>Delete Expense</span>
                            </button>

                            <button
                                type="submit"
                                className="group bg-gradient-to-r from-[#0B2838] to-[#1a4459] hover:from-[#1a4459] hover:to-[#0B2838] text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center gap-3"
                            >
                                <span>Save Changes</span>
                                <svg
                                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ExpensesEdit;
