import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PostModal from "./PostModal";
import Toast from "./Toast";

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
      <PostModal />
      <Toast />
      <div
        style={{
          display: "flex",
          flex: 1,
          marginTop: "119px",
        }}
      >
        <Sidebar />
        <main
          style={{
            marginLeft: "250px",
            padding: "0.5rem 2rem 2rem 2rem",
            backgroundColor: "#FFFFFF",
            flex: 1,
            overflowY: "auto",
            height: "calc(100vh - 119px)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
