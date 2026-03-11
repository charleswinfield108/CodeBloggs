import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSession } from "../context/SessionContext";
import AvatarInitials from "../components/AvatarInitials";
import { FiThumbsUp } from "react-icons/fi";

const Home = () => {
  const { session } = useSession();
  const [userPostCount, setUserPostCount] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [lastPostDate, setLastPostDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());

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
          const filteredPosts = data.data.filter(
            (post) => post.user_id === session.id
          );
          setUserPosts(filteredPosts);
          setUserPostCount(filteredPosts.length);

          // Find the most recent post
          if (filteredPosts.length > 0) {
            const mostRecent = filteredPosts.reduce((latest, post) => {
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

  const handleLikePost = async (postId, currentLikes) => {
    // Toggle like status
    const isCurrentlyLiked = likedPosts.has(postId);
    const newLikeCount = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;

    // Update local state
    const newLikedPosts = new Set(likedPosts);
    if (isCurrentlyLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);

    // Update posts array with new like count
    setUserPosts(
      userPosts.map((post) =>
        post._id === postId ? { ...post, likes: newLikeCount } : post
      )
    );

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
      setUserPosts(
        userPosts.map((post) =>
          post._id === postId ? { ...post, likes: currentLikes } : post
        )
      );
    }
  };

  return (
    <Layout>
      <div style={{ display: "flex", gap: "1.5rem", height: "100%", overflow: "hidden" }}>
        {/* Left Column */}
        <div style={{ flex: "0 0 240px", display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: "auto" }}>
          {/* Avatar Section */}
          <div
            style={{
              backgroundColor: "#F6F7FF",
              padding: "1rem",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              flexShrink: 0,
            }}
          >
            <AvatarInitials
              firstName={session?.first_name}
              lastName={session?.last_name}
              size={80}
            />
            <h2 style={{ color: "#1F2340", fontSize: "1rem", margin: 0, textAlign: "center" }}>
              {session?.first_name} {session?.last_name}
            </h2>
          </div>

          {/* User Status Section */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E3E6F5",
              borderRadius: "8px",
              padding: "1rem",
              flexShrink: 0,
            }}
          >
            <h3 style={{ color: "#8D88EA", fontSize: "0.875rem", margin: "0 0 0.75rem 0", fontWeight: "600" }}>
              Status
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#666", fontSize: "0.75rem" }}>Posts Created</span>
                <span
                  style={{
                    color: "#8D88EA",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  {loading ? "..." : userPostCount}
                </span>
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#E3E6F5",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#666", fontSize: "0.75rem" }}>Last Post</span>
                <span style={{ color: "#8D88EA", fontSize: "0.7rem" }}>
                  {loading ? "Loading..." : lastPostDate ? lastPostDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* User Information Section */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E3E6F5",
              borderRadius: "8px",
              padding: "1rem",
              flexShrink: 0,
            }}
          >
            <h3 style={{ color: "#8D88EA", fontSize: "0.875rem", margin: "0 0 0.75rem 0", fontWeight: "600" }}>
              Information
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <p style={{ color: "#999", fontSize: "0.65rem", margin: "0 0 0.25rem 0" }}>
                  NAME
                </p>
                <p style={{ color: "#1F2340", fontSize: "0.75rem", margin: 0, fontWeight: "500" }}>
                  {session?.first_name} {session?.last_name}
                </p>
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#E3E6F5",
                }}
              />
              <div>
                <p style={{ color: "#999", fontSize: "0.65rem", margin: "0 0 0.25rem 0" }}>
                  AUTH LEVEL
                </p>
                <p style={{ color: "#1F2340", fontSize: "0.75rem", margin: 0, fontWeight: "500" }}>
                  {session?.auth_level === "admin" ? "Administrator" : "User"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Posts List with Scrollbar */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
          <h2 style={{ color: "#1F2340", fontSize: "1.25rem", margin: "0 0 0.75rem 0" }}>
            Your Recent Posts
          </h2>

          {!loading && userPosts.length > 0 && (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                overflowY: "auto",
              }}
            >
              {userPosts
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((post) => (
                  <div
                    key={post._id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E3E6F5",
                      borderRadius: "8px",
                      padding: "1rem",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <p
                      style={{
                        color: "#1F2340",
                        fontSize: "0.875rem",
                        margin: "0 0 0.5rem 0",
                        lineHeight: "1.5",
                      }}
                    >
                      {post.content}
                    </p>
                    <p style={{ color: "#999", fontSize: "0.75rem", margin: "0 0 0.75rem 0" }}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleLikePost(post._id, post.likes)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          backgroundColor: likedPosts.has(post._id)
                            ? "#8D88EA"
                            : "#F0F0F5",
                          color: likedPosts.has(post._id) ? "#FFFFFF" : "#666",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.4rem 0.8rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                        }}
                        onMouseEnter={(e) => {
                          if (!likedPosts.has(post._id)) {
                            e.currentTarget.style.backgroundColor = "#E3E6F5";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!likedPosts.has(post._id)) {
                            e.currentTarget.style.backgroundColor = "#F0F0F5";
                          }
                        }}
                      >
                        <FiThumbsUp size={14} />
                        <span>{post.likes}</span>
                      </button>
                    </div>

                    {post.comments && post.comments.length > 0 && (
                      <div
                        style={{
                          marginTop: "0.75rem",
                          paddingTop: "0.75rem",
                          borderTop: "1px solid #E3E6F5",
                        }}
                      >
                        <p
                          style={{
                            color: "#666",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            margin: "0 0 0.5rem 0",
                          }}
                        >
                          Comments ({post.comments.length})
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                          }}
                        >
                          {post.comments.map((comment) => (
                            <div
                              key={comment._id}
                              style={{
                                backgroundColor: "#F9F9FB",
                                padding: "0.5rem",
                                borderRadius: "6px",
                                borderLeft: "3px solid #8D88EA",
                              }}
                            >
                              <p
                                style={{
                                  color: "#1F2340",
                                  fontSize: "0.75rem",
                                  margin: "0 0 0.25rem 0",
                                  lineHeight: "1.4",
                                }}
                              >
                                {comment.content}
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <p
                                  style={{
                                    color: "#999",
                                    fontSize: "0.65rem",
                                    margin: 0,
                                  }}
                                >
                                  {new Date(comment.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                                {comment.likes > 0 && (
                                  <span
                                    style={{
                                      color: "#8D88EA",
                                      fontSize: "0.65rem",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {comment.likes}{" "}
                                    {comment.likes === 1 ? "like" : "likes"}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!post.comments || post.comments.length === 0) && (
                      <div
                        style={{
                          marginTop: "0.75rem",
                          paddingTop: "0.75rem",
                          borderTop: "1px solid #E3E6F5",
                        }}
                      >
                        <p
                          style={{
                            color: "#999",
                            fontSize: "0.75rem",
                            margin: 0,
                          }}
                        >
                          No comments yet
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {!loading && userPosts.length === 0 && (
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
                No posts yet. Click "Post" to create one!
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
              <p style={{ color: "#8D88EA", fontSize: "0.875rem" }}>Loading posts...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
