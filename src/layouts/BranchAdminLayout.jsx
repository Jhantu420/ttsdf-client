import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiUsers, FiSettings, FiFileText, FiMenu, FiX } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { useAuth } from "../context/AppContext";

const BranchAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { handleLogout } = useAuth();

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.documentElement.classList.add("overflow-hidden"); // Prevent scrolling
      document.body.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex md:h-[120vh]">
      {/* Mobile Sidebar Toggle */}
      <button
        className="absolute top-4 left-4 md:hidden p-2 bg-blue-800 text-white rounded cursor-pointer hover:bg-blue-900 transition duration-300"
        onClick={() => setIsSidebarOpen(true)} // Open sidebar
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white p-5 w-64 h-full fixed md:relative z-50 transition-transform duration-300 ${
          isSidebarOpen || window.innerWidth >= 768
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Close Button (Visible on Mobile Only) */}
        <button
          className="absolute top-4 right-4 md:hidden p-2 text-white hover:bg-purple-800 rounded-full cursor-pointer"
          onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile
        >
          <FiX size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-6 text-center md:text-left mt-8 md:mt-0">
          Branch Admin
        </h1>

        <nav className="space-y-4">
          <NavLink
            to="/branchAdmin"
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
          >
            <MdDashboard className="text-lg" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="create-students"
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
          >
            <FiUsers className="text-lg" />
            <span>Register Student</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="text-center w-full bg-purple-700 hover:bg-purple-800 rounded-xl p-2 mt-6 cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default BranchAdminLayout;
