import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { AiFillHome } from "react-icons/ai";
import { MdArticle } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();
  const { session } = useSession();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Home", path: "/home", icon: AiFillHome },
    { label: "Blogs", path: "/blogs", icon: MdArticle },
    { label: "Network", path: "/network", icon: FaUsers },
    ...(session?.auth_level === "admin" ? [{ label: "Admin", path: "/admin", icon: MdAdminPanelSettings }] : []),
  ];

  return (
    <aside
      style={{
        position: "fixed",
        left: "12px",
        top: "119px",
        width: "226px",
        bottom: "20px",
        backgroundColor: "#FBFCFD",
        border: "0.5px solid #F8F8F8",
        borderRadius: "20px",
        padding: "1rem 0",
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
          marginTop: "10px",
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
                color: isActive(item.path) ? "#FFFFFF" : "#8D88EA",
                backgroundColor: isActive(item.path) ? "#8D88EA" : "transparent",
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
                  e.currentTarget.style.backgroundColor = "#E8E3FF";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <IconComponent size={20} color={isActive(item.path) ? "#FFFFFF" : "#8D88EA"} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
