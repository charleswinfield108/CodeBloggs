import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

/**
 * ProtectedRoute Component
 * Higher-order component that guards routes requiring authentication
 * Prevents unauthenticated users from accessing protected pages
 * Validates session token on every route navigation for consistent access control
 * 
 * Props:
 * - children: React component(s) to render if authenticated
 * 
 * Return:
 * - Loading state while session is being initialized/validated
 * - Redirect to /login if user is not authenticated or token is invalid
 * - Render children if user is authenticated with valid token
 */
const ProtectedRoute = ({ children }) => {
  // Get session data and loading state from context
  const { session, loading } = useSession();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  /**
   * Validate token on component mount
   * Ensures token is current before rendering protected component
   */
  useEffect(() => {
    const validateTokenOnNavigation = async () => {
      try {
        // Get token from cookies
        const cookies = document.cookie.split(";");
        let token = null;
        
        for (let cookie of cookies) {
          cookie = cookie.trim();
          if (cookie.startsWith("session_token=")) {
            token = decodeURIComponent(cookie.substring("session_token=".length));
            break;
          }
        }

        if (!token) {
          setIsValid(false);
          setIsValidating(false);
          return;
        }

        // Validate token with backend
        const validateResponse = await fetch(
          `http://localhost:5050/validate_token?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (validateResponse.ok) {
          const validateData = await validateResponse.json();
          if (validateData.status === "ok" && validateData.data.valid) {
            setIsValid(true);
          } else {
            // Token is invalid or expired
            localStorage.removeItem("session");
            document.cookie = "session_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
            setIsValid(false);
          }
        } else {
          // Backend error - token is invalid
          localStorage.removeItem("session");
          document.cookie = "session_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
          setIsValid(false);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    // Only validate if session exists and not already loading
    if (session && !loading) {
      validateTokenOnNavigation();
    } else if (!loading && !session) {
      setIsValidating(false);
      setIsValid(false);
    }
  }, [session, loading]); // Re-validate when session or loading state changes

  // While session or token is being validated, show loading message
  if (loading || isValidating) {
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

  // If session doesn't exist or token is invalid after validation, redirect to login
  // replace: true prevents user from navigating back
  if (!session || !isValid) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated with valid token, render the protected component
  return children;
};

export default ProtectedRoute;
