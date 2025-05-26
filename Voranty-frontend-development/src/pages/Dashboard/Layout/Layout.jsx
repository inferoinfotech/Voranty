 
import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen relative flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-[#0B2838] transition-all duration-300
          xl:translate-x-0 xl:w-[260px] w-[260px] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar onClose={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 xl:ml-[260px] h-screen">
        <Outlet context={{ toggleSidebar }} />
      </div>

      {/* Overlay when sidebar is open on small/medium screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0  "
          onClick={toggleSidebar} // Close sidebar when clicking outside
        ></div>
      )}
    </div>
  );
};

export default Layout;





  

