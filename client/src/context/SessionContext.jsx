import React, { createContext, useState, useEffect } from "react";

export const SessionContext = createContext();

// Utility functions for cookie management
const setCookie = (name, value, days = 1) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
};

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

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  // Initialize session from cookie on mount
  useEffect(() => {
    const tokenFromCookie = getCookie("session_token");
    if (tokenFromCookie) {
      try {
        const storedSession = localStorage.getItem("session");
        if (storedSession) {
          const sessionData = JSON.parse(storedSession);
          setSession(sessionData);
          // Set online status based on stored session data
          setIsOnline(sessionData?.isOnline ?? true);
        }
      } catch (error) {
        console.error("Failed to parse stored session:", error);
        localStorage.removeItem("session");
        deleteCookie("session_token");
      }
    }
    setLoading(false);
  }, []);

  const login = (sessionData) => {
    setSession(sessionData);
    setIsOnline(true);
    // Store token in cookie (1 day expiration)
    setCookie("session_token", sessionData.session_token, 1);
    // Store full session data in localStorage for reference
    localStorage.setItem("session", JSON.stringify(sessionData));
  };

  const logout = async () => {
    // Call backend logout endpoint with token as query parameter
    if (session?.session_token) {
      try {
        await fetch(`http://localhost:5050/session/logout?token=${encodeURIComponent(session.session_token)}`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Logout request failed:", error);
      }
    }
    
    // Clear session from state and storage
    setSession(null);
    setIsOnline(false);
    localStorage.removeItem("session");
    deleteCookie("session_token");
  };

  return (
    <SessionContext.Provider value={{ session, loading, isOnline, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = React.useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
};
