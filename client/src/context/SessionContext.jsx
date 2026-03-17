import React, { createContext, useState, useEffect } from "react";

/**
 * SessionContext
 * React Context for managing user session state across entire application
 * Provides session data, login/logout functions, and loading state
 */
export const SessionContext = createContext();

/**
 * setCookie - Utility function to store session token in browser cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiration time in days (default: 1 day)
 * Sets secure flag for HTTPS connections and path to root
 */
const setCookie = (name, value, days = 1) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const isSecure = window.location.protocol === 'https:' ? ';secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/${isSecure}`;
};

/**
 * getCookie - Utility function to retrieve session token from browser cookie
 * @param {string} name - Cookie name to retrieve
 * @returns {string|null} - Cookie value or null if not found
 */
const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

/**
 * deleteCookie - Utility function to remove session token from browser cookie
 * @param {string} name - Cookie name to delete
 * Sets expiration date to past to effectively delete cookie
 */
const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

/**
 * SessionProvider Component
 * Wraps entire app to provide session context and authentication functions
 * Manages session persistence via cookies and localStorage
 * Tracks user activity via ping endpoint
 */
export const SessionProvider = ({ children }) => {
  // Current user session object (null if not logged in)
  const [session, setSession] = useState(null);
  // Loading state during app initialization
  const [loading, setLoading] = useState(true);
  // User online status
  const [isOnline, setIsOnline] = useState(false);

  /**
   * Initialization effect - runs once on component mount
   * Restores session from cookie and localStorage if available
   * Validates token with backend to ensure session is still valid
   * Clears invalid session data to prevent stale sessions
   */
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const tokenFromCookie = getCookie("session_token");
        if (tokenFromCookie) {
          // Validate token with backend
          const validateResponse = await fetch(`http://localhost:5050/validate_token?token=${encodeURIComponent(tokenFromCookie)}`, {
            method: "GET",
            credentials: "include",
          });

          if (validateResponse.ok) {
            const validateData = await validateResponse.json();
            if (validateData.status === "ok" && validateData.data.valid) {
              // Token is valid, restore session from localStorage
              const storedSession = localStorage.getItem("session");
              if (storedSession) {
                const sessionData = JSON.parse(storedSession);
                setSession(sessionData);
                setIsOnline(sessionData?.isOnline ?? true);
              }
            } else {
              // Token is invalid, clear all session data
              localStorage.removeItem("session");
              deleteCookie("session_token");
            }
          } else {
            // Backend returned error, token is invalid or expired
            localStorage.removeItem("session");
            deleteCookie("session_token");
          }
        } else {
          // No token found, check if there's valid session in localStorage anyway
          const storedSession = localStorage.getItem("session");
          if (storedSession) {
            // Sessions without a valid token should be cleared
            localStorage.removeItem("session");
          }
        }
      } catch (error) {
        console.error("Failed to initialize session:", error);
        // On network error, still try to restore from localStorage as fallback
        try {
          const storedSession = localStorage.getItem("session");
          if (storedSession) {
            const sessionData = JSON.parse(storedSession);
            setSession(sessionData);
            setIsOnline(sessionData?.isOnline ?? true);
          }
        } catch (parseError) {
          console.error("Failed to parse stored session:", parseError);
          localStorage.removeItem("session");
          deleteCookie("session_token");
        }
      } finally {
        // Set loading to false after initialization
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  /**
   * Activity tracking effect
   * Pings server every 30 seconds to update user's lastSeen timestamp
   * Indicates user is active and online
   * Only runs if user is logged in (session.id exists)
   */
  useEffect(() => {
    if (!session?.id) return; // Only run if user is logged in

    // Function to ping server with user activity
    const pingServer = async () => {
      try {
        await fetch("http://localhost:5050/user/ping", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: session.id }),
        });
      } catch (error) {
        console.error("Activity ping failed:", error);
      }
    };

    // Initial ping on login
    pingServer();

    // Set up interval to ping every 30 seconds (30000 ms)
    const pingInterval = setInterval(pingServer, 30000);

    // Cleanup: stop pinging when user logs out or component unmounts
    return () => clearInterval(pingInterval);
  }, [session?.id]);

  /**
   * Token validation effect
   * Validates session token every 5 minutes to ensure token hasn't expired
   * Instantly logs user out if token is invalid
   * Provides consistent access control across protected screens
   */
  useEffect(() => {
    if (!session?.id) return; // Only run if user is logged in

    const validateTokenPeriodically = async () => {
      try {
        const tokenFromCookie = getCookie("session_token");
        if (!tokenFromCookie) {
          // Token missing, clear session
          setSession(null);
          setIsOnline(false);
          localStorage.removeItem("session");
          deleteCookie("session_token");
          return;
        }

        // Validate token with backend
        const validateResponse = await fetch(
          `http://localhost:5050/validate_token?token=${encodeURIComponent(tokenFromCookie)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (validateResponse.ok) {
          const validateData = await validateResponse.json();
          if (validateData.status !== "ok" || !validateData.data.valid) {
            // Token is invalid or expired
            console.warn("Session token validation failed - logging out");
            setSession(null);
            setIsOnline(false);
            localStorage.removeItem("session");
            deleteCookie("session_token");
          }
        } else {
          // Backend error - treat as invalid token
          console.error("Token validation endpoint error - logging out");
          setSession(null);
          setIsOnline(false);
          localStorage.removeItem("session");
          deleteCookie("session_token");
        }
      } catch (error) {
        console.error("Periodic token validation error:", error);
        // Don't logout on network errors - let user retry
      }
    };

    // Validate token immediately, then every 5 minutes (300000 ms)
    validateTokenPeriodically();
    const validationInterval = setInterval(validateTokenPeriodically, 300000);

    // Cleanup: stop validation when user logs out or component unmounts
    return () => clearInterval(validationInterval);
  }, [session?.id]);

  /**
   * login - Function to establish user session after successful authentication
   * Stores session token in cookie (1 day expiration)
   * Stores full session object in localStorage for reference
   * Updates React state with session data
   * @param {object} sessionData - User session object from backend
   */
  const login = (sessionData) => {
    setSession(sessionData);
    setIsOnline(true);
    // Store token in cookie with 1 day expiration
    setCookie("session_token", sessionData.session_token, 1);
    // Store full session data in localStorage for reference and component access
    localStorage.setItem("session", JSON.stringify(sessionData));
  };

  /**
   * logout - Function to end user session and clean up all data
   * Calls backend logout endpoint to invalidate session server-side
   * Clears session from state, cookies, and localStorage
   * @returns {Promise} - Async function
   */
  const logout = async () => {
    // Call backend logout endpoint to mark user offline and delete session
    if (session?.session_token) {
      try {
        await fetch(`http://localhost:5050/session/logout?token=${encodeURIComponent(session.session_token)}`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Logout request failed:", error);
      }
    }
    
    // Clear session from state and all storage mechanisms
    setSession(null);
    setIsOnline(false);
    localStorage.removeItem("session");
    deleteCookie("session_token");
  };

  // Provide session context to all child components
  return (
    <SessionContext.Provider value={{ session, loading, isOnline, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

/**
 * useSession - Custom hook to access session context
 * Provides access to: session, loading, isOnline, login, logout
 * Must be used within a component wrapped by SessionProvider
 * @returns {object} - Session context value
 * @throws {Error} - If used outside SessionProvider
 */
export const useSession = () => {
  const context = React.useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
};
