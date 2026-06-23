import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

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

  return children;
};

export default ProtectedRoute;