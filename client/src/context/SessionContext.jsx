import React, { createContext, useState, useEffect } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage on mount
  useEffect(() => {
    const storedSession = localStorage.getItem("session");
    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession));
      } catch (error) {
        console.error("Failed to parse stored session:", error);
        localStorage.removeItem("session");
      }
    }
    setLoading(false);
  }, []);

  const login = (sessionData) => {
    setSession(sessionData);
    localStorage.setItem("session", JSON.stringify(sessionData));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("session");
  };

  return (
    <SessionContext.Provider value={{ session, loading, login, logout }}>
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
