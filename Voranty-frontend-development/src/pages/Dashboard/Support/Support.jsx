import React, { useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import { X } from "lucide-react";
import suppportimg from "../../../assets/images/cover/3d-rendering-hair-style-avatar-design_23-2151869145.jpg";
import Callcenter from "../../../assets/images/cover/call-center-abstract-concept_335657-3001.jpg";
import customer from "../../../assets/images/cover/customer-support-flat-design-illustration_23-2148889374.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import ChatBotWidget from "@/components/Chatbot/ChatBotWidget";

const SupportModal = ({ onClose }) => {
  const [isChatBotMaximized, setIsChatBotMaximized] = useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

  const handleAsklyCardClick = () => {
    setIsChatBotMaximized(true);
  };

  return createPortal(
    <>
      {/* Backdrop with opacity */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 flex h-[400px] mt-16 justify-center z-[9999]">
        <div 
          className="bg-white w-full max-w-[900px] p-6 rounded-lg shadow-[0_10px_20px_rgba(0,_0,_0,_0.2)] m-4"
          data-aos="zoom-out"
          data-aos-duration="600"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#0B2838]">Support Methods</h2>
            <button
              className="text-gray-500 hover:text-gray-700 font-bold"
              onClick={onClose}
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="flex pt-4 pb-4">
            <div>
              <img
                src={suppportimg}
                alt="avatar"
                className="w-[45px] h-[45px] rounded-full"
              />
            </div>
            <div>
              <p className="text-lg font-bold text-[#0B2838] ml-2 mt-2">Admin</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[17px] text-[#0B2838] mb-5 font-semibold">
            Looking for help? We have many ways to support you! Choose one of
            the options below.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Askly Card */}
            <div
              className="flex items-center p-6 border rounded-lg hover:shadow-md transition duration-300 hover:border-[#0B2838] cursor-pointer"
              onClick={handleAsklyCardClick} // Trigger maximization
            >
              {/* Left Side - Text */}
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1">Askly</h3>
                <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                  Message Askly for 24/7, real-time support to answer most
                  questions!
                </p>
              </div>
              {/* Right Side - Image */}
              <img
                src={Callcenter}
                alt="Askly"
                className="w-[100px] h-[100px] ml-4"
              />
            </div>

            {/* Help Site Card */}
            <div className="flex items-center border rounded-lg p-4">
              {/* Left Side - Text */}
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1">
                  Help Site
                </h3>
                <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                  Use our collection of robust self-service help guides and best
                  practices.
                </p>
              </div>
              {/* Right Side - Image */}
              <img
                src={customer}
                alt="Help Site"
                className="w-[100px] h-[100px] ml-8"
              />
            </div>
          </div>

          {/* ChatBot Widget */}
          {isChatBotMaximized && <ChatBotWidget />}
        </div>
      </div>
    </>,
    document.getElementById('modal-root')
  );
};

export default SupportModal;
