import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, logout } = useSession();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Blogs", path: "/blogs" },
    { label: "Network", path: "/network" },
    ...(session?.auth_level === "admin" ? [{ label: "Admin", path: "/admin" }] : []),
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
        display: "flex",
        flexDirection: "column",
      }}
    >
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          flex: 1,
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

      <div
        style={{
          borderTop: "1px solid #E3E6F5",
          padding: "1rem 1.5rem",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            backgroundColor: "#8D88EA",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: "600",
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#6C63D9")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#8D88EA")}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
