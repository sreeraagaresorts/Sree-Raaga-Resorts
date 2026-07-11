import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { API_URL } from "../config/api";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  // If no token at all, redirect immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If admin, redirect to admin panel
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.role === "admin") {
        return <Navigate to="/admin" replace />;
      }
    } catch (e) {
      // Ignore parsing error
    }
  }

  return <ValidateUser token={token}>{children}</ValidateUser>;
};

// Validates that the user account still exists on the server.
// If the server returns 401/403/404, the account was deleted — force logout.
const ValidateUser = ({ token, children }) => {
  const [status, setStatus] = useState("checking"); // "checking" | "valid" | "invalid"

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (cancelled) return;

        if (res.status === 401 || res.status === 403 || res.status === 404) {
          // Account deleted or token revoked — clear everything
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setStatus("invalid");
        } else {
          setStatus("valid");
        }
      } catch {
        // Network error — allow through (don't log out on connectivity issues)
        if (!cancelled) setStatus("valid");
      }
    };

    verify();
    return () => { cancelled = true; };
  }, [token]);

  if (status === "checking") {
    // Minimal loading state while verifying
    return (
      <div className="min-h-screen bg-[#050F1C] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#C8A64D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "invalid") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;