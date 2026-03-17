import React from "react";
import Layout from "../components/Layout";

const UserManager = () => {
  return (
    <Layout>
      <div>
        <h2 style={{ color: "#8D88EA", fontSize: "1.25rem", margin: "0 0 0.5rem 0" }}>
          User Manager
        </h2>
        <p style={{ color: "#666", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
          Manage users, roles, and permissions.
        </p>
        {/* Components will be added here */}
      </div>
    </Layout>
  );
};

export default UserManager;
