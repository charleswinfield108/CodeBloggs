import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePostModal } from "../context/PostModalContext";
import { useSession } from "../context/SessionContext";
import { FiChevronDown } from "react-icons/fi";

const Header = () => {
  const { openModal } = usePostModal();
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleAccountSettings = () => {
    // TODO: Navigate to account settings or show toast
    console.log("Account Settings clicked");
    setIsMenuOpen(false);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: "250px",
        right: 0,
        height: "95px",
        backgroundColor: "#8D88EA",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Post Button */}
      <button
        onClick={openModal}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "white",
          color: "#8D88EA",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#F0F0F5";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "white";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Post
      </button>

      {/* User Menu Section */}
      <div
        ref={menuRef}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Username and Menu Trigger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            padding: "0.5rem 0.75rem",
            borderRadius: "6px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <span>{session?.first_name || "User"}</span>
          <FiChevronDown
            size={20}
            style={{
              transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "0.5rem",
              backgroundColor: "white",
              border: "1px solid #E3E6F5",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              minWidth: "180px",
              zIndex: 2000,
              overflow: "hidden",
            }}
          >
            {/* Account Settings Option */}
            <button
              onClick={handleAccountSettings}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                textAlign: "left",
                backgroundColor: "transparent",
                border: "none",
                color: "#1F2340",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F6F7FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Account Settings
            </button>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                backgroundColor: "#E3E6F5",
              }}
            />

            {/* Logout Option */}
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                textAlign: "left",
                backgroundColor: "transparent",
                border: "none",
                color: "#E74C3C",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FADBD8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
