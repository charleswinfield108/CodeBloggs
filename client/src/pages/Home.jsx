import React from "react";
import Layout from "../components/Layout";
import { useSession } from "../context/SessionContext";

const Home = () => {
  const { session } = useSession();

  return (
    <Layout>
      <div>
        <h1 style={{ color: "#1F2340", fontSize: "2rem", marginBottom: "1rem" }}>
          Welcome, {session?.first_name}!
        </h1>
        <p style={{ color: "#666", fontSize: "1rem", marginBottom: "2rem" }}>
          Welcome to CodeBloggs. This is your home page where you can see your posts and activity.
        </p>
        
        <div style={{ 
          backgroundColor: "#F6F7FF", 
          padding: "2rem", 
          borderRadius: "8px", 
          borderLeft: "4px solid #8D88EA",
          marginBottom: "2rem"
        }}>
          <h2 style={{ color: "#8D88EA", marginTop: 0 }}>User Profile</h2>
          <p><strong>Name:</strong> {session?.first_name} {session?.last_name}</p>
          <p><strong>Auth Level:</strong> {session?.auth_level}</p>
        </div>

        <div style={{ backgroundColor: "#F6F7FF", padding: "2rem", borderRadius: "8px" }}>
          <h2 style={{ color: "#8D88EA", marginTop: 0 }}>Your Posts</h2>
          <p style={{ color: "#666" }}>Your posts will appear here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
