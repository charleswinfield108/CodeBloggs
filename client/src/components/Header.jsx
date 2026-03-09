import React from "react";

const Header = () => {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "80px",
        backgroundColor: "#8D88EA",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          color: "white",
          margin: 0,
          fontSize: "1.5rem",
          fontWeight: "500",
        }}
      >
        CodeBloggs
      </h1>
    </header>
  );
};

export default Header;
