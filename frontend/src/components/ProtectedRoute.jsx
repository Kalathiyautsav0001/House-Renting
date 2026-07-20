import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute Component
 * Redirects to /login if no authentication token is found in localStorage.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login while saving the current location they were trying to go to
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
