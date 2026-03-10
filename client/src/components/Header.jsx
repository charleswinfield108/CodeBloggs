import React from "react";
import { usePostModal } from "../context/PostModalContext";

const Header = () => {
  const { openModal } = usePostModal();

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
        justifyContent: "flex-end",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
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
    </header>
  );
};

export default Header;
