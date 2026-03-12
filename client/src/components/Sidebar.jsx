import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import logo from "../assets/CodeBloggs_ logo.png";
import { AiOutlineHome } from "react-icons/ai";
import { MdArticle } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();
  const { session } = useSession();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Home", path: "/home", icon: AiOutlineHome },
    { label: "Blogs", path: "/blogs", icon: MdArticle },
    { label: "Network", path: "/network", icon: FaUsers },
    ...(session?.auth_level === "admin" ? [{ label: "Admin", path: "/admin", icon: MdAdminPanelSettings }] : []),
  ];

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "250px",
        height: "100vh",
        backgroundColor: "#F6F7FF",
        borderRight: "1px solid #8D88EA",
        padding: "0",
        zIndex: 999,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link
        to="/home"
        style={{
          height: "95px",
          padding: "0 1.5rem",
          marginBottom: "0",
          backgroundColor: "#F6F7FF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        <img
          src={logo}
          alt="CodeBloggs Logo"
          style={{
            width: "85%",
            maxWidth: "140px",
            height: "auto",
            marginLeft: "-20px",
          }}
        />
      </Link>
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginTop: "40px",
          flex: 1,
        }}
      >
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: "0.75rem 1.5rem 0.75rem 40px",
                textDecoration: "none",
                color: isActive(item.path) ? "#8D88EA" : "#1F2340",
                backgroundColor: isActive(item.path) ? "#FFFFFF" : "transparent",
                border: isActive(item.path) ? "2px solid #8D88EA" : "2px solid transparent",
                borderRadius: "16px",
                marginLeft: "1.3rem",
                marginRight: "1.3rem",
                fontWeight: isActive(item.path) ? "600" : "400",
                transition: "all 0.2s ease",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <IconComponent size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
