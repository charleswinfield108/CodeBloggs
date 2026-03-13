import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

/**
 * ProtectedRoute Component
 * Higher-order component that guards routes requiring authentication
 * Prevents unauthenticated users from accessing protected pages
 * 
 * Props:
 * - children: React component(s) to render if authenticated
 * 
 * Return:
 * - Loading state while session is being initialized
 * - Redirect to /login if user is not authenticated
 * - Render children if user is authenticated
 */
const ProtectedRoute = ({ children }) => {
  // Get session data and loading state from context
  const { session, loading } = useSession();

  // While session is being restored from storage, show loading message
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        <p style={{ color: "#8D88EA", fontSize: "1.125rem" }}>Loading...</p>
      </div>
    );
  }

  // If no session exists after loading completes, redirect to login
  // replace: true prevents user from navigating back
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
