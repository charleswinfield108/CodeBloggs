import React, { createContext, useState, useEffect } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  // Initialize session from localStorage on mount
  useEffect(() => {
    const storedSession = localStorage.getItem("session");
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        setSession(sessionData);
        // User was previously logged in, so they should be online when page loads
        setIsOnline(sessionData ? true : false);
      } catch (error) {
        console.error("Failed to parse stored session:", error);
        localStorage.removeItem("session");
      }
    }
    setLoading(false);
  }, []);

  const login = (sessionData) => {
    setSession(sessionData);
    setIsOnline(true);
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
  };

  // Handle going offline when page closes
  useEffect(() => {
    const handlePageClose = () => {
      // Tell server user is offline without destroying session
      if (session?.id) {
        navigator.sendBeacon(
          `http://localhost:5050/user/${encodeURIComponent(session.id)}/status`,
          JSON.stringify({ isOnline: false })
        );
      }
    };

    window.addEventListener("beforeunload", handlePageClose);
    return () => window.removeEventListener("beforeunload", handlePageClose);
  }, [session]);

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
