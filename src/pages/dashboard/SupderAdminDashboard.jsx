import React, { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import StudentList from "../StudentList";

const SuperAdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6">
        <StudentList />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;