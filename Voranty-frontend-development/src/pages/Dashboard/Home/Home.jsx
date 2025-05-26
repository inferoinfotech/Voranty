import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Loader from "@/components/Loader/Loader";
import { fetchDueDateReminders } from "@/Service/Api/api";
import NoContent from "@/components/NoContentScreen/noContentScreen";

const Home = () => {
  const { toggleSidebar } = useOutletContext();
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);
  const [emailSent, setEmailSent] = useState(false); 

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchExpenses = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDueDateReminders();
        
        if (data.dueExpenses) {
          setExpenses(data.dueExpenses);
        } else if (data.message) {
          setMessage(data.message);
        }
      } catch (error) {
        console.log("Failed to fetch expenses:", error);
        setMessage("Failed to fetch reminders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);
  return (
    <div className="flex flex-col bg-[#fffaf3] min-h-screen">
      {/* Header Section */}
      <div className=" shadow-md p-4 flex justify-between items-center fixed top-0  w-full z-40 bg-white">
        <button
          onClick={toggleSidebar}
          className="xl:hidden text-[#0B2838] text-2xl p-2 hover:bg-gray-100 rounded"
        >
          <FaBars />
        </button>
        <h1 className="text-xl md:text-3xl font-bold text-[#0B2838]">Home</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center py-6 px-4 mt-20 ">
        <h1 className="text-2xl md:text-3xl text-[#0B2838] font-bold mb-8 text-center">
          Upcoming Reminders...
        </h1>
        {/* <iframe
        src='https://interfaces.zapier.com/embed/chatbot/cm65jt20e000iwgulz97mabxk'
        height='600px'
        width='800px'
        allow='clipboard-write *'
        style={{ border: 'none' }}
      />         */}
      {isLoading ? (
          <Loader />
        ) : expenses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6 w-full ">
            {expenses.map((expense) => (
              <UserCard key={expense._id} expense={expense} />
            ))}
          </div>
        ) : (
          <NoContent/>
        )}
      </div>
    </div>
  );
};

const UserCard = ({ expense }) => {
  const { merchant, amount, warrentyDate, description, category, imageUrl } = expense;
  return (
    <div className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className="bg-gradient-to-r from-[#0B2838] to-[#1a4459] p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-xl font-bold truncate">{merchant}</h2>
          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {category || 'Warranty Info'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 rounded-lg p-3 hover:bg-gray-100 transition-colors">
            <p className="text-md  text-gray-500 font-medium mb-1">Warranty Until</p>
            <p className="text-sm text-gray-800 font-medium">
              {new Date(warrentyDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3 hover:bg-gray-100 transition-colors">
            <p className="text-md text-gray-500 font-medium mb-1">Amount</p>
            <p className="text-sm text-gray-800 font-medium">
              ${amount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-md text-gray-500 font-medium mb-2">Description</p>
          <p className="text-sm text-gray-800 line-clamp-2 font-medium">
            {description || "No description provided"}
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default Home;
