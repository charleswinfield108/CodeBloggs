import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import AvatarInitials from "../components/AvatarInitials";

const Network = () => {
  const [users, setUsers] = useState([]);
  const [usersWithPosts, setUsersWithPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersAndPosts = async () => {
      try {
        // Fetch all users
        const usersResponse = await fetch("http://localhost:5050/users");
        const usersData = await usersResponse.json();

        if (usersData.status === "ok" && Array.isArray(usersData.data)) {
          setUsers(usersData.data);

          // Fetch latest post for each user
          const usersWithLatestPost = await Promise.all(
            usersData.data.map(async (user) => {
              try {
                const postsResponse = await fetch(`http://localhost:5050/posts/user/${user._id}`);
                const postsData = await postsResponse.json();

                let latestPost = null;
                if (postsData.status === "ok" && Array.isArray(postsData.data) && postsData.data.length > 0) {
                  // Posts should already be sorted newest first from backend
                  latestPost = postsData.data[0];
                }

                return {
                  ...user,
                  latestPost,
                };
              } catch (err) {
                console.error(`Error fetching posts for user ${user._id}:`, err);
                return {
                  ...user,
                  latestPost: null,
                };
              }
            })
          );

          setUsersWithPosts(usersWithLatestPost);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndPosts();
  }, []);

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        <h2 style={{ color: "#1F2340", fontSize: "1.25rem", margin: "0 0 0.75rem 0" }}>
          Community Members
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#FEE",
              border: "1px solid #FCC",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              color: "#C33",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </div>
        )}

        {!loading && usersWithPosts.length > 0 && (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
              overflowY: "auto",
              paddingRight: "0.5rem",
            }}
          >
            {usersWithPosts.map((user) => (
              <div
                key={user._id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E3E6F5",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  height: "fit-content",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* User Header with Avatar and Name */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <AvatarInitials
                    firstName={user.first_name}
                    lastName={user.last_name}
                    size={48}
                  />
                  <div>
                    <p style={{ color: "#1F2340", fontSize: "0.95rem", margin: 0, fontWeight: "600" }}>
                      {user.first_name} {user.last_name}
                    </p>
                    <p style={{ color: "#999", fontSize: "0.8rem", margin: "0.25rem 0 0 0" }}>
                      {user.occupation || "No occupation"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <p style={{ color: "#666", fontSize: "0.8rem", margin: "0 0 1rem 0" }}>
                  📍 {user.location || "No location"}
                </p>

                {/* Divider */}
                <div style={{ height: "1px", backgroundColor: "#E3E6F5", margin: "0 0 1rem 0" }} />

                {/* Latest Post Section */}
                {user.latestPost ? (
                  <div>
                    <p style={{ color: "#999", fontSize: "0.75rem", fontWeight: "600", margin: "0 0 0.5rem 0" }}>
                      LATEST POST
                    </p>
                    <p style={{ color: "#1F2340", fontSize: "0.85rem", lineHeight: "1.5", margin: "0 0 0.75rem 0" }}>
                      {user.latestPost.content.length > 150
                        ? `${user.latestPost.content.substring(0, 150)}...`
                        : user.latestPost.content}
                    </p>
                    <p style={{ color: "#999", fontSize: "0.7rem", margin: 0 }}>
                      {new Date(user.latestPost.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: "#999", fontSize: "0.8rem", fontStyle: "italic", margin: 0 }}>
                      No posts yet
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && usersWithPosts.length === 0 && (
          <div
            style={{
              flex: 1,
              backgroundColor: "#F6F7FF",
              border: "2px dashed #8D88EA",
              borderRadius: "8px",
              padding: "1rem",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ color: "#8D88EA", fontSize: "0.875rem", margin: 0 }}>
              No users found in the community.
            </p>
          </div>
        )}

        {loading && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ color: "#8D88EA", fontSize: "0.875rem" }}>Loading community members...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Network;
