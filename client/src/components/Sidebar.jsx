import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import logo from "../assets/CodeBloggs_ logo.png";
import { AiOutlineHome } from "react-icons/ai";
import { MdArticle } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, logout } = useSession();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Home", path: "/home", icon: AiOutlineHome },
    { label: "Blogs", path: "/blogs", icon: MdArticle },
    { label: "Network", path: "/network", icon: FaUsers },
    ...(session?.auth_level === "admin" ? [{ label: "Admin", path: "/admin", icon: MdAdminPanelSettings }] : []),
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
        top: 0,
        width: "250px",
        height: "100vh",
        backgroundColor: "#F6F7FF",
        borderRight: "1px solid #E3E6F5",
        padding: "1.5rem 0",
        zIndex: 999,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "1rem 1.5rem 2rem 1.5rem",
          marginBottom: "1rem",
          borderBottom: "1px solid #E3E6F5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
      </div>
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
<<<<<<< HEAD
          marginTop: "40px",
=======
          flex: 1,
>>>>>>> 1412b48fecd134e98dd90ac6c078517a9c8473aa
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
                  e.currentTarget.style.backgroundColor = "#F0F0F5";
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
