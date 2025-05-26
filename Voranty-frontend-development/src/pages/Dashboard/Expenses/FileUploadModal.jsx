import React from 'react';
import { IoClose } from "react-icons/io5";
import filePhoto from "../../../assets/images/cover/26e5c88256a44fbc68cef4985f043af0.webp";
import Loader from "@/components/Loader/Loader";

const FileUploadModal = ({ 
  isOpen, 
  onClose, 
  handleFileChange, 
  handleFileUpload, 
  selectedFile,
  isUploading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed !top-0 inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9998]">
      <div className="bg-white rounded-lg shadow-lg p-7 transform transition-transform duration-300 scale-95 opacity-0 animate-fade-in relative w-[500px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold font-poppins">Upload Excel File</h2>
          <button className="group p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-300" onClick={onClose}>
            <IoClose className="text-2xl text-gray-400 group-hover:text-gray-600 group-hover:rotate-90 transition-all duration-300" />
          </button>
        </div>

        <p className="text-gray-600 mb-6 font-inter">
          Please upload a CSV file with the following columns :
          <span className="block mt-2 text-sm font-inter">
            • Date
            • Category
            • Amount
            • Description
            • Merchant
            • Warranty Date
          </span>
        </p>
        <button
        onClick={() => {
          const link = document.createElement("a");
          link.href = "/demo.csv"; // Ensure the file is in the public folder
          link.download = "Demo.csv"; // Forces the browser to download it
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        className="bg-gradient-to-r from-[#0B2838] to-[#1a4459] my-3 hover:from-[#1a4459] hover:to-[#0B2838] transition-all duration-300 ease-in-out transform hover:scale-[1.02] text-white px-2 text-sm font-semibold lg:text-md xl:text-md lg:px-4 pb-2 pt-2 rounded  flex items-center"
      >
        Demo CSV
      </button>


        {/* Content */}
        {isUploading ? (
          <div className="h-[300px] flex flex-col items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="space-y-4">
            <div 
              className="w-full h-48 relative mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            >
              {selectedFile ? (
                <div className="text-green-600 font-inter">
                  Selected: {selectedFile.name}
                </div>
              ) : (
                <div className="text-center">
                  <img src={filePhoto} alt="Upload placeholder" />
                </div>
              )}
            </div>

            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />

            <div className="flex justify-end">
              <button
                onClick={handleFileUpload}
                disabled={!selectedFile || isUploading}
                className={`py-2 px-4 rounded transition-colors ${
                  selectedFile && !isUploading
                  ? 'bg-gradient-to-r from-[#0B2838] to-[#1a4459] text-white hover:from-[#1a4459] hover:to-[#0B2838] transition-all duration-300 ease-in-out transform hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </div>
        )}
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
    </div>
  );
};

export default FileUploadModal; 

// import React, { useState } from 'react';
// import { IoClose } from "react-icons/io5";
// import filePhoto from "../../../assets/images/cover/26e5c88256a44fbc68cef4985f043af0.webp";
// import Loader from "@/components/Loader/Loader";

// const FileUploadModal = ({ 
//   isOpen, 
//   onClose, 
//   handleFileChange, 
//   handleFileUpload, 
//   selectedFile, 
//   isUploading 
// }) => {
//   const [previewData, setPreviewData] = useState([]);

//   const handleFilePreview = (file) => {
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const text = event.target.result;
//       const rows = text.split("\n").slice(0, 6); // Take the first 5 rows (header + 5 rows)
//       const parsedData = rows.map((row) => row.split(","));
//       setPreviewData(parsedData);
//     };
//     reader.readAsText(file);
//   };

//   const handleFileChangeWithPreview = (e) => {
//     handleFileChange(e);
//     const file = e.target.files[0];
//     if (file) {
//       handleFilePreview(file);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed !top-0 inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9998]">
//       <div className="bg-white rounded-lg shadow-lg p-7 transform transition-transform duration-300 scale-95 opacity-0 animate-fade-in relative w-[600px]">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-2">
//           <h2 className="text-xl font-bold font-poppins">Upload Excel File</h2>
//           <button className="p-2 rounded" onClick={onClose}>
//             <IoClose className="text-2xl" />
//           </button>
//         </div>

//         <p className="text-gray-600 mb-6 font-inter">
//           Please upload a CSV file with the following columns :
//           <span className="block mt-2 text-sm font-inter">
//             • Date
//             • Category
//             • Amount
//             • Description
//             • Merchant
//             • Warranty Date
//           </span>
//         </p>

//         {/* Content */}
//         {isUploading ? (
//           <div className="h-[300px] flex flex-col items-center justify-center">
//             <Loader />
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div 
//               className="w-full h-48 relative mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
//               onClick={() => document.getElementById("fileInput").click()}
//             >
//               {selectedFile ? (
//                 <div className="text-green-600 font-inter">
//                   Selected: {selectedFile.name}
//                 </div>
//               ) : (
//                 <div className="text-center">
//                   <img src={filePhoto} alt="Upload placeholder" />
//                 </div>
//               )}
//             </div>

//             <input
//               type="file"
//               accept=".xlsx, .xls, .csv"
//               onChange={handleFileChangeWithPreview}
//               className="hidden"
//               id="fileInput"
//             />

//             {/* Preview Table */}
//             {previewData.length > 0 && (
//               <div className="overflow-auto max-h-48 border rounded-lg">
//                 <table className="w-full table-auto text-sm">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       {previewData[0].map((header, idx) => (
//                         <th key={idx} className="p-2 border">{header.trim()}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {previewData.slice(1).map((row, rowIndex) => (
//                       <tr key={rowIndex} className="even:bg-gray-50">
//                         {row.map((cell, cellIndex) => (
//                           <td key={cellIndex} className="p-2 border">{cell.trim()}</td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             <div className="flex justify-end">
//               <button
//                 onClick={handleFileUpload}
//                 disabled={!selectedFile || isUploading}
//                 className={`py-2 px-4 rounded transition-colors ${
//                   selectedFile && !isUploading
//                   ? 'bg-gradient-to-r from-[#0B2838] to-[#1a4459] text-white hover:from-[#1a4459] hover:to-[#0B2838] transition-all duration-300 ease-in-out transform hover:scale-[1.02]'
//                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 }`}
//               >
//                 {isUploading ? 'Uploading...' : 'Upload File'}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes fade-in {
//           0% {
//             opacity: 0;
//             transform: scale(0.9);
//           }
//           100% {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FileUploadModal;
