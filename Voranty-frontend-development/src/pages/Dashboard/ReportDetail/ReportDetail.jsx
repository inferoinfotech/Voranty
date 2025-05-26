import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { FaBars, FaChevronDown, FaTrash } from "react-icons/fa";
import ReportDetails from "../../../assets/images/cover/emptystate__reports.svg";
import { LuSend } from "react-icons/lu";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ReportCard from '../../../components/Cards/ReportCard/ReportCard';
import { fetchReportDetails, addCommentToReport } from "../../../Service/Api/api";
import { calculateDaysAgo } from "@/components/Cards/ReportCard/dateUtil";

function ReportDetail({ expenseData }) {
  const { toggleSidebar } = useOutletContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleOptionClick = (option) => {
    setIsDropdownOpen(false);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchReportDetails(id);
        setRules(data);

        const initialMessages = [
          {
            id: "system-message",
            time: calculateDaysAgo(data.createdAt),
            text: "You created this report",
            createdAt: data.createdAt,
          },
        ];

        if (data.Comment) {
          const existingComments = data.Comment.map((comment, index) => ({
            id: `existing-${index}`,
            time: calculateDaysAgo(comment.createdAt || data.createdAt),
            text: comment.text || comment,
            createdAt: comment.createdAt || data.createdAt,
          }));
          initialMessages.push(...existingComments);
        }

        setMessages(initialMessages);
      } catch (error) {
        console.log("Failed to fetch expenses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCardClick = (expense) => {
    setSelectedExpense(expense);
  };

  const handleBackClick = () => {
    navigate("/reports"); 
  };

  const [inputValue, setInputValue] = useState(""); 
  const [messages, setMessages] = useState([]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessages((prevMessages) =>
        prevMessages.map((message) => ({
          ...message,
          time: calculateDaysAgo(message.createdAt),
        }))
      );
    }, 60000); 

    return () => clearInterval(intervalId);
  }, []);

  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    try {
      const currentTime = new Date().toISOString();
      await addCommentToReport(id, inputValue, currentTime);

      const newMessage = {
        id: `new-${Date.now()}`,
        time: "Just now",
        text: inputValue,
        createdAt: currentTime,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputValue("");
    } catch (error) {
      console.log("Failed to add comment:", error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0); 
    return normalized;
  };


  const handleDelete = () => {
    const updatedExpenses = expenses.filter(
      (expense) => expense.id !== selectedExpense.id
    );
    setExpenses(updatedExpenses); 

    setSelectedExpense((prevState) => ({
      ...prevState,
      status: "PENDING", // Set status to "PENDING"
    }));

    setExpenses((prevState) => [...prevState, selectedExpense]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fffaf3]">
      <div className="shadow-md p-4 flex justify-between items-center fixed top-0 right-0   left-0 sm:left-0  xl:left-[260px] z-40 bg-white">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="xl:hidden text-[#0B2838] text-2xl p-2 hover:bg-gray-100 rounded"
        >
          <FaBars />
        </button>

        {/* Title */}
        <h1 className="text-md md:text-2xl font-bold text-[#0B2838]">
          Reports Details
        </h1>

      </div>
      <div
        className="mt-20 ms-4 flex items-center space-x-2 cursor-pointer w-20 bg-gradient-to-r from-[#0B2838] to-[#1a4459] hover:from-[#1a4459] hover:to-[#0B2838] transition-all duration-300 ease-in-out transform hover:scale-[1.02] rounded text-white p-3"
        onClick={handleBackClick}
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium">Back </span>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 ">
        <ReportCard
          rules={rules}
          messages={messages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSend={handleSend}
        />
      </div>
    </div>
  );
}

export default ReportDetail;
