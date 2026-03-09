import React from "react";
import Layout from "../components/Layout";

const Network = () => {
  return (
    <Layout>
      <div>
        <h1 style={{ color: "#1F2340", fontSize: "2rem", marginBottom: "1rem" }}>
          Network
        </h1>
        <p style={{ color: "#666", fontSize: "1rem", marginBottom: "2rem" }}>
          Connect with other CodeBloggs community members.
        </p>

        <div style={{ backgroundColor: "#F6F7FF", padding: "2rem", borderRadius: "8px" }}>
          <h2 style={{ color: "#8D88EA", marginTop: 0 }}>Community Members</h2>
          <p style={{ color: "#666" }}>Community members will appear here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Network;
