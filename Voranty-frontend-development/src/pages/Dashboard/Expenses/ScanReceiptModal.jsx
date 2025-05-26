import React from "react";
import { IoClose } from "react-icons/io5";
import Loader from "@/components/Loader/Loader";
import filePhoto from "../../../assets/images/cover/26e5c88256a44fbc68cef4985f043af0.webp";

const ScanReceiptModal = ({
  isOpen,
  onClose,
  imagePreview,
  handleImageUpload,
  handleSave,
  error,
  isScanningReceipt,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Global overlay */}
     

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9998]">
        <div className="bg-white rounded-lg shadow-lg p-7 transform transition-transform duration-300 scale-95 opacity-0 animate-fade-in relative w-[500px]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold font-poppins">Scan Receipt</h2>
            <button className="group p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-300" onClick={onClose}>
              <IoClose className="text-2xl text-gray-400 group-hover:text-gray-600 group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>

          <p className="text-gray-600 mb-6 font-inter">
            Upload or scan your receipt here.
          </p>

          {isScanningReceipt ? (
            <div className="h-[300px] flex flex-col items-center justify-center">
              <Loader />
            </div>
          ) : (
            <>
              <div
                className="w-full h-48 relative mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => document.getElementById("imageUpload").click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={filePhoto} alt="Upload placeholder" />
                )}
              </div>

              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={!imagePreview}
                  className={`py-2 px-4 rounded transition-colors ${
                    imagePreview
                      ? "bg-gradient-to-r from-[#0B2838] to-[#1a4459] text-white hover:from-[#1a4459] hover:to-[#0B2838] transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Analyze Receipt
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default ScanReceiptModal;
