import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePostModal } from "../context/PostModalContext";
import { useSession } from "../context/SessionContext";
import { useToast } from "../context/ToastContext";
import { FiChevronDown, FiEdit3, FiSettings, FiLogOut } from "react-icons/fi";

const Header = () => {
  const { openModal } = usePostModal();
  const { session, logout } = useSession();
  const { showToast } = useToast();
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
    showToast("Account Settings was clicked", "info", 3000);
    setIsMenuOpen(false);
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (session?.first_name && session?.last_name) {
      return (session.first_name[0] + session.last_name[0]).toUpperCase();
    }
    return "U";
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: "250px",
        right: 0,
        height: "95px",
        backgroundColor: "#F6F7FF",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        boxShadow: "none",
        borderBottom: "1px solid #8D88EA",
      }}
    >
      {/* Post Button - Center/Right */}
      <button
        onClick={openModal}
        style={{
          padding: "0.75rem 1.75rem",
          backgroundColor: "#2ED3B7",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          boxShadow: "0 2px 8px rgba(46, 211, 183, 0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#1CB89C";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(46, 211, 183, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#2ED3B7";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(46, 211, 183, 0.3)";
        }}
      >
        <FiEdit3 size={18} />
        <span>Create Post</span>
      </button>

      {/* User Menu Section */}
      <div
        ref={menuRef}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        {/* User Avatar with Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#8D88EA",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "0.85rem",
              boxShadow: "0 2px 8px rgba(141, 136, 234, 0.3)",
            }}
          >
            {getInitials()}
          </div>

          {/* Username and Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "transparent",
              border: "none",
              color: "#1F2340",
              fontSize: "0.95rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F6F7FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span>{session?.first_name || "User"}</span>
            <FiChevronDown
              size={18}
              style={{
                transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </button>
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "0.75rem",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E3E6F5",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              minWidth: "200px",
              zIndex: 2000,
              overflow: "hidden",
            }}
          >
            {/* Account Settings Option */}
            <button
              onClick={handleAccountSettings}
              style={{
                width: "100%",
                padding: "0.85rem 1.25rem",
                textAlign: "left",
                backgroundColor: "transparent",
                border: "none",
                color: "#1F2340",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F6F7FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <FiSettings size={16} color="#8D88EA" />
              <span>Account Settings</span>
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
                padding: "0.85rem 1.25rem",
                textAlign: "left",
                backgroundColor: "transparent",
                border: "none",
                color: "#E74C3C",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FADBD8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <FiLogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
