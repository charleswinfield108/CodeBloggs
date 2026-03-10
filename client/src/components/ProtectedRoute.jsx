import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useSession();

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

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
