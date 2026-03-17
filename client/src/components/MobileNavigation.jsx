import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { usePostModal } from "../context/PostModalContext";
import logo from "../assets/CodeBloggs_ logo.png";

/**
 * MobileNavigation Component
 * Horizontal navigation bar for mobile/tablet devices (< 768px)
 * Features:
 * - Logo and hamburger menu toggle
 * - Responsive navigation items
 * - Mobile-optimized styling
 */
const MobileNavigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session } = useSession();
  const { openModal } = usePostModal();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "Home", path: "/home", icon: "🏠" },
    { name: "Blogs", path: "/blogs", icon: "📝" },
    { name: "Network", path: "/network", icon: "👥" },
    ...(session?.auth_level === "admin"
      ? [
          { name: "Admin", path: "/admin/posts", icon: "⚙️" },
          { name: "Users", path: "/admin/users", icon: "👤" },
        ]
      : []),
  ];

  return (
    <nav
      style={{
        backgroundColor: "#8D88EA",
        padding: "0.75rem 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #E0E0E0",
        gap: "1rem",
      }}
    >
      {/* Logo */}
      <Link to="/home" style={{ textDecoration: "none" }}>
        <img
          src={logo}
          alt="CodeBloggs Logo"
          style={{
            height: "40px",
            width: "auto",
            cursor: "pointer",
          }}
        />
      </Link>

      {/* Create Post Button */}
      <button
        onClick={() => openModal()}
        style={{
          backgroundColor: "#FFFFFF",
          color: "#8D88EA",
          border: "none",
          borderRadius: "6px",
          padding: "0.5rem 1rem",
          fontSize: "0.85rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#F0F0F5";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#FFFFFF";
        }}
      >
        + Post
      </button>

      {/* Hamburger Menu Toggle */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "#FFFFFF",
          fontSize: "1.5rem",
          cursor: "pointer",
          padding: "0.25rem 0.5rem",
        }}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E0E0E0",
            maxHeight: "calc(100vh - 64px)",
            overflowY: "auto",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "1rem",
                color: isActive(item.path) ? "#8D88EA" : "#1F2340",
                borderBottom: "1px solid #E0E0E0",
                textDecoration: "none",
                fontWeight: isActive(item.path) ? "600" : "400",
                backgroundColor: isActive(item.path) ? "#F6F7FF" : "#FFFFFF",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#F6F7FF";
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = "#FFFFFF";
                }
              }}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </div>
      )}

      {/* Overlay to close menu */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99,
          }}
        />
      )}
    </nav>
  );
};

export default MobileNavigation;
