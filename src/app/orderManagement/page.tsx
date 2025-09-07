"use client";
import { useState } from "react";
import OrderManagement from "../components/orderManagement";
import Sidebar from "../components/sidebar";
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
  };
  return (
    <div className="relative flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Main Content */}
      <div
        className={`flex-grow transition-all main-content duration-300 ease-in-out ${
          sidebarOpen ? "overflow-hidden" : ""
        }`}
      >
        {!sidebarOpen && (
          <button
            className="fixed lg:hidden z-50 bottom-10 right-8 bg-teal-800 w-12 h-12 rounded-full drop-shadow-lg flex justify-center items-center text-white hover:bg-teal-700 duration-300"
            onClick={toggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-6 h-6"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"
              />
            </svg>
          </button>
        )}
        <div className="pb-0">
          {" "}
          {/* Add padding at the bottom */}
          <OrderManagement />
        </div>
      </div>
    </div>
  );
}
