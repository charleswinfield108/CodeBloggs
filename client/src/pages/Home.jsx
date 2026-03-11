import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSession } from "../context/SessionContext";
import AvatarInitials from "../components/AvatarInitials";

const Home = () => {
  const { session } = useSession();
  const [userPostCount, setUserPostCount] = useState(0);
  const [lastPostDate, setLastPostDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPostData = async () => {
      if (!session?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5050/posts");
        const data = await response.json();

        if (data.status === "ok" && Array.isArray(data.data)) {
          // Filter posts that belong to the logged-in user
          const userPosts = data.data.filter(
            (post) => post.user_id === session.id
          );
          setUserPostCount(userPosts.length);

          // Find the most recent post
          if (userPosts.length > 0) {
            const mostRecent = userPosts.reduce((latest, post) => {
              const postDate = new Date(post.createdAt);
              const latestDate = new Date(latest.createdAt);
              return postDate > latestDate ? post : latest;
            });
            setLastPostDate(new Date(mostRecent.createdAt));
          } else {
            setLastPostDate(null);
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPostData();
  }, [session?.id]);

  const formatDate = (date) => {
    if (!date) return "No posts yet";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          marginBottom: "2rem",
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start"
        }}>
          <AvatarInitials 
            firstName={session?.first_name} 
            lastName={session?.last_name} 
            size={100}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ color: "#8D88EA", marginTop: 0 }}>User Profile</h2>
            <p><strong>Name:</strong> {session?.first_name} {session?.last_name}</p>
            <p><strong>Auth Level:</strong> {session?.auth_level}</p>
          </div>
        </div>

        <div style={{ backgroundColor: "#F6F7FF", padding: "2rem", borderRadius: "8px" }}>
          <h2 style={{ color: "#8D88EA", marginTop: 0 }}>Your Posts</h2>
          <p style={{ fontSize: "2rem", color: "#8D88EA", fontWeight: "bold", margin: "0.5rem 0" }}>
            {loading ? "Loading..." : userPostCount}
          </p>
          <p style={{ color: "#666" }}>
            {loading 
              ? "Fetching your post count..." 
              : `You have created ${userPostCount} ${userPostCount === 1 ? "post" : "posts"}.`}
          </p>

          <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #E3E6F5" }}>
            <p style={{ color: "#666", marginBottom: "0.5rem" }}>
              <strong>Last Post:</strong>
            </p>
            <p style={{ color: "#8D88EA", fontSize: "1rem" }}>
              {loading ? "Loading..." : formatDate(lastPostDate)}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
