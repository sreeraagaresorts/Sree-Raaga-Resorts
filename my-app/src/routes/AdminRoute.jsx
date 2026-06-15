import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  const userStr = localStorage.getItem("user");
  let isAdmin = false;

  if (adminToken && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === "admin") {
        isAdmin = true;
      }
    } catch (e) {
      isAdmin = false;
    }
  }

  if (!isAdmin) {
    // Clear potentially corrupted or unauthorized session data
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;