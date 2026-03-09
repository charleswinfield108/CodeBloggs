import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const Sidebar = () => {
  const location = useLocation();
  const { session } = useSession();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Blogs", path: "/blogs" },
    { label: "Network", path: "/network" },
    ...(session?.auth_level === "admin" ? [{ label: "Admin", path: "/admin" }] : []),
  ];

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: "80px",
        width: "250px",
        height: "calc(100vh - 80px)",
        backgroundColor: "#F6F7FF",
        borderRight: "1px solid #E3E6F5",
        padding: "1.5rem 0",
        zIndex: 999,
        overflowY: "auto",
      }}
    >
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              padding: "0.75rem 1.5rem",
              textDecoration: "none",
              color: isActive(item.path) ? "#8D88EA" : "#1F2340",
              backgroundColor: isActive(item.path) ? "#FFFFFF" : "transparent",
              borderLeft: isActive(item.path) ? "4px solid #8D88EA" : "4px solid transparent",
              fontWeight: isActive(item.path) ? "600" : "400",
              paddingLeft: isActive(item.path) ? "calc(1.5rem - 4px)" : "1.5rem",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = "#F0F0F5";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
