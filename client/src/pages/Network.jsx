import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import AvatarInitials from "../components/AvatarInitials";
import { FiThumbsUp } from "react-icons/fi";

const Network = () => {
  const [users, setUsers] = useState([]);
  const [usersWithPosts, setUsersWithPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());

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
                  console.log(`User ${user._id} latest post:`, latestPost);
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

  const handleLikePost = async (postId, currentLikes) => {
    // Toggle like status
    const isCurrentlyLiked = likedPosts.has(postId);
    const newLikeCount = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;

    // Update local state for liked posts
    const newLikedPosts = new Set(likedPosts);
    if (isCurrentlyLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);

    // Update the users array with new like count
    const updatedUsers = usersWithPosts.map((user) => {
      if (user.latestPost && user.latestPost._id === postId) {
        return {
          ...user,
          latestPost: {
            ...user.latestPost,
            likes: newLikeCount,
          },
        };
      }
      return user;
    });
    setUsersWithPosts(updatedUsers);

    // Call backend to persist the like update
    try {
      await fetch(`http://localhost:5050/post/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likes: newLikeCount }),
      });
    } catch (error) {
      console.error("Error updating post likes:", error);
      // Revert on error
      const revertedLikes = new Set(likedPosts);
      if (isCurrentlyLiked) {
        revertedLikes.add(postId);
      } else {
        revertedLikes.delete(postId);
      }
      setLikedPosts(revertedLikes);
      
      // Revert the users array
      const revertedUsers = usersWithPosts.map((user) => {
        if (user.latestPost && user.latestPost._id === postId) {
          return {
            ...user,
            latestPost: {
              ...user.latestPost,
              likes: currentLikes,
            },
          };
        }
        return user;
      });
      setUsersWithPosts(revertedUsers);
    }
  };

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
                    <p style={{ color: "#999", fontSize: "0.7rem", margin: "0 0 1rem 0" }}>
                      {new Date(user.latestPost.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    {/* Like Button */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                      <button
                        onClick={() => handleLikePost(user.latestPost._id, user.latestPost.likes)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          backgroundColor: likedPosts.has(user.latestPost._id)
                            ? "#8D88EA"
                            : "#F0F0F5",
                          color: likedPosts.has(user.latestPost._id) ? "#FFFFFF" : "#666",
                          border: "none",
                          borderRadius: "8px",
                          padding: "0.6rem 1rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                        }}
                        onMouseEnter={(e) => {
                          if (!likedPosts.has(user.latestPost._id)) {
                            e.currentTarget.style.backgroundColor = "#E3E6F5";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!likedPosts.has(user.latestPost._id)) {
                            e.currentTarget.style.backgroundColor = "#F0F0F5";
                          }
                        }}
                      >
                        <FiThumbsUp size={16} />
                        <span>{user.latestPost.likes} {user.latestPost.likes === 1 ? "like" : "likes"}</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {user.latestPost.comments && user.latestPost.comments.length > 0 && (
                      <div
                        style={{
                          borderTop: "1px solid #E3E6F5",
                          paddingTop: "1rem",
                        }}
                      >
                        <p
                          style={{
                            color: "#666",
                            fontSize: "0.8rem",
                            fontWeight: "700",
                            margin: "0 0 0.75rem 0",
                          }}
                        >
                          Comments ({user.latestPost.comments.length})
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem",
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                        >
                          {user.latestPost.comments.map((comment) => (
                            <div
                              key={comment._id}
                              style={{
                                backgroundColor: "#F9F9FB",
                                padding: "0.75rem",
                                borderRadius: "8px",
                                borderLeft: "4px solid #8D88EA",
                              }}
                            >
                              <p
                                style={{
                                  color: "#1F2340",
                                  fontSize: "0.8rem",
                                  margin: "0",
                                  lineHeight: "1.4",
                                }}
                              >
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
