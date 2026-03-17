import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { usePostModal } from "../context/PostModalContext";
import { AiFillHome } from "react-icons/ai";
import { MdArticle } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

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
    { name: "Home", path: "/home", icon: AiFillHome },
    { name: "Blogs", path: "/blogs", icon: MdArticle },
    { name: "Network", path: "/network", icon: FaUsers },
    ...(session?.auth_level === "admin"
      ? [{ name: "Admin", path: "/admin", icon: MdAdminPanelSettings }]
      : []),
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: "95px",
        left: "0",
        right: "0",
        backgroundColor: "#8D88EA",
        padding: "0.75rem 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #E0E0E0",
        gap: "1rem",
        zIndex: 999,
      }}
    >
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
        + Create Post
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
            top: "159px",
            left: 0,
            right: 0,
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E0E0E0",
            maxHeight: "calc(100vh - 159px)",
            overflowY: "auto",
            zIndex: 998,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
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
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
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
                <IconComponent size={20} />
                {item.name}
              </Link>
            );
          })}
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
