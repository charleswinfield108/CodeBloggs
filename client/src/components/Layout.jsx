import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      <div
        style={{
          display: "flex",
          flex: 1,
          marginTop: "80px",
        }}
      >
        <Sidebar />
        <main
          style={{
            marginLeft: "250px",
            padding: "2rem",
            backgroundColor: "#FFFFFF",
            flex: 1,
            overflowY: "auto",
            height: "calc(100vh - 80px)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
