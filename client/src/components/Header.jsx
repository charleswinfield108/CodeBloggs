import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { useToast } from "../context/ToastContext";
import { FiChevronDown, FiSettings, FiLogOut } from "react-icons/fi";
import { getAvatarColor } from "../utils/avatarColors";
import logo from "../assets/CodeBloggs_ logo.png";

/**
 * Header Component - Responsive Application Header
 * 
 * MDN Responsive Design:
 * - Fixed at top with responsive padding
 * - Mobile-friendly logo sizing
 * - Touch-friendly dropdown menu
 */
const Header = () => {
  const { session, logout } = useSession();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    showToast("Feature Coming Soon", "info", 3000);
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
        top: isDesktop ? "12px" : "0px",
        left: isDesktop ? "12px" : "0px",
        right: isDesktop ? "12px" : "0px",
        height: "95px",
        backgroundColor: "#FBFCFD",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        paddingLeft: isDesktop ? "2rem" : "1rem",
        paddingRight: isDesktop ? "2rem" : "1rem",
        boxShadow: "none",
        border: "0.5px solid #F8F8F8",
        gap: isDesktop ? "2rem" : "1rem",
        borderRadius: isDesktop ? "20px" : "0px",
      }}
    >
      {/* Logo - Left */}
      <div
        onClick={() => navigate("/home")}
        style={{
          display: "flex",
          alignItems: "center",
          flex: "0 0 auto",
          marginLeft: isDesktop ? "20px" : "0",
          cursor: "pointer",
          transition: "opacity 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <img
          src={logo}
          alt="CodeBloggs Logo"
          style={{
            width: isDesktop ? "85%" : "100%",
            maxWidth: isDesktop ? "200px" : "120px",
            height: "auto",
            marginLeft: isDesktop ? "-20px" : "0",
          }}
        />
      </div>

      {/* Post Button - Center */}
      {/* Removed: Create Post button */}

      {/* Spacer to push user menu to the right */}
      <div style={{ flex: "1" }} />

      {/* User Menu Section - Right */}
      <div
        ref={menuRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          minWidth: "fit-content",
          flex: "0 0 auto",
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
              backgroundColor: getAvatarColor(session?.first_name, session?.last_name),
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
              border: "1px solid #8D88EA",
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
                backgroundColor: "#8D88EA",
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
