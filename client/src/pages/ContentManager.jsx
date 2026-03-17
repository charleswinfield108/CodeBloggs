import React from "react";
import Layout from "../components/Layout";

const ContentManager = () => {
  return (
    <Layout>
      <div>
        <h2 style={{ color: "#8D88EA", fontSize: "1.25rem", margin: "0 0 0.5rem 0" }}>
          Content Manager
        </h2>
        <p style={{ color: "#666", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
          Moderate posts, comments, and reports.
        </p>
        {/* Components will be added here */}
      </div>
    </Layout>
  );
};

export default ContentManager;
