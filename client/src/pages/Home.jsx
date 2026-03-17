import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useSession } from "../context/SessionContext";
import { useToast } from "../context/ToastContext";
import { usePostModal } from "../context/PostModalContext";
import AvatarInitials from "../components/AvatarInitials";
import { FiThumbsUp, FiMessageCircle } from "react-icons/fi";

/**
 * Home Component - User Dashboard with Responsive Layout
 * 
 * Features:
 * - /home shows logged-in user's profile
 * - /home/{userId} shows specific user's profile (admin only for other users)
 * - Responsive layout: mobile (single column), desktop (two-column)
 * - Permission checks with toast notifications
 */
const Home = () => {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();
  const { showToast } = useToast();
  const { registerPostCreatedCallback } = usePostModal();
  
  // Determine which user to view
  const targetUserId = paramUserId || session?.id;
  
  // State
  const [userPostCount, setUserPostCount] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [lastPostDate, setLastPostDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [viewingUser, setViewingUser] = useState(null);
  const [openCommentModal, setOpenCommentModal] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [creatingComment, setCreatingComment] = useState({});
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [hasPermission, setHasPermission] = useState(true);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check permission to view user profile
  useEffect(() => {
    const checkPermission = () => {
      // If viewing own profile, always allowed
      if (targetUserId === session?.id) {
        setHasPermission(true);
        return;
      }

      // If not admin and trying to view another user, deny access
      if (session?.auth_level !== "admin") {
        setHasPermission(false);
        showToast("Unauthorized: You can only view your own profile", "error");
        navigate("/home", { replace: true });
        return;
      }

      // Admin can view any user
      setHasPermission(true);
    };

    checkPermission();
  }, [targetUserId, session?.id, session?.auth_level, navigate, showToast]);

  // Fetch user and post data
  const fetchUserPostData = async () => {
    if (!hasPermission || !targetUserId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all users to find the target user
      const usersResponse = await fetch("http://localhost:5050/users?limit=1000", {
        credentials: "include",
      });
      const usersData = await usersResponse.json();
      
      let targetUser = null;
      if (usersData.users && Array.isArray(usersData.users)) {
        targetUser = usersData.users.find((u) => u._id === targetUserId);
      }

      if (!targetUser) {
        showToast("User not found", "error");
        navigate("/home", { replace: true });
        setLoading(false);
        return;
      }

      setViewingUser(targetUser);

      // Fetch all posts
      const postsResponse = await fetch("http://localhost:5050/posts", {
        credentials: "include",
      });
      const postsData = await postsResponse.json();

      if (postsData.status === "ok" && Array.isArray(postsData.data)) {
        // Filter posts that belong to the target user
        const filteredPosts = postsData.data.filter(
          (post) => post.user_id === targetUserId
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
      showToast("Error loading user data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasPermission) {
      fetchUserPostData();
    }
  }, [targetUserId, hasPermission]);

  useEffect(() => {
    registerPostCreatedCallback(fetchUserPostData);
  }, []);

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

  const handleCreateComment = async (postId) => {
    const content = commentInputs[postId]?.trim();
    if (!content) {
      return;
    }

    setCreatingComment((prev) => ({ ...prev, [postId]: true }));

    try {
      const response = await fetch("http://localhost:5050/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          user_id: session?.id,
          post_id: postId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      const result = await response.json();

      // Add the new comment to the post
      setUserPosts(
        userPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [
                  ...(post.comments || []),
                  {
                    _id: result.data._id || new Date().getTime().toString(),
                    content: result.data.content || content,
                    user_id: session?.id,
                    createdAt: new Date().toISOString(),
                    likes: 0,
                  },
                ],
              }
            : post
        )
      );

      // Clear the input and close modal
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setOpenCommentModal(null);
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setCreatingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: isDesktop ? "row" : "column", gap: "1.5rem", height: "100%", overflow: "hidden" }}>
        {/* Left Column - User Info (240px on desktop, full width on mobile) */}
        <div style={{ flex: isDesktop ? "0 0 240px" : "0 0 auto", display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: isDesktop ? "auto" : "visible", maxHeight: isDesktop ? "100%" : "auto" }}>
          {/* Avatar Section */}
          <div
            style={{
              backgroundColor: "#FAFBFF",
              padding: "0.8rem",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.6rem",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
            }}
          >
            <AvatarInitials
              firstName={viewingUser?.first_name}
              lastName={viewingUser?.last_name}
              size={64}
            />
            <h2 style={{ color: "#1F2340", fontSize: isDesktop ? "0.9rem" : "0.85rem", margin: 0, textAlign: "center" }}>
              {viewingUser?.first_name} {viewingUser?.last_name}
            </h2>
          </div>

          {/* User Status Section */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #8D88EA",
              borderRadius: "8px",
              padding: "0.8rem",
              flexShrink: 0,
            }}
          >
            <h3 style={{ color: "#8D88EA", fontSize: "0.8rem", margin: "0 0 0.6rem 0", fontWeight: "600" }}>
              Status
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
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
                  backgroundColor: "#8D88EA",
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
              border: "1px solid #8D88EA",
              borderRadius: "8px",
              padding: "0.8rem",
              flexShrink: 0,
            }}
          >
            <h3 style={{ color: "#8D88EA", fontSize: "0.8rem", margin: "0 0 0.6rem 0", fontWeight: "600" }}>
              Information
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div>
                <p style={{ color: "#999", fontSize: "0.65rem", margin: "0 0 0.25rem 0" }}>
                  NAME
                </p>
                <p style={{ color: "#1F2340", fontSize: "0.75rem", margin: 0, fontWeight: "500" }}>
                  {viewingUser?.first_name} {viewingUser?.last_name}
                </p>
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#8D88EA",
                }}
              />
              <div>
                <p style={{ color: "#999", fontSize: "0.65rem", margin: "0 0 0.25rem 0" }}>
                  AUTH LEVEL
                </p>
                <p style={{ color: "#1F2340", fontSize: "0.75rem", margin: 0, fontWeight: "500" }}>
                  {viewingUser?.auth_level === "admin" ? "Administrator" : "Basic"}
                </p>
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#8D88EA",
                }}
              />
              <div>
                <p style={{ color: "#999", fontSize: "0.65rem", margin: "0 0 0.25rem 0" }}>
                  LOGIN STATUS
                </p>
                <p style={{ color: "#1F2340", fontSize: "0.75rem", margin: 0, fontWeight: "500" }}>
                  {viewingUser?.isOnline ? "🟢" : "🔴"} {viewingUser?.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Posts List with Scrollbar */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: isDesktop ? 0 : "auto", overflow: isDesktop ? "hidden" : "visible", maxHeight: isDesktop ? "calc(100% - 150px)" : "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h2 style={{ color: "#8D88EA", fontSize: isDesktop ? "1.25rem" : "1rem", margin: 0 }}>
              {viewingUser?.first_name}'s Posts
            </h2>
          </div>

          {!loading && userPosts.length > 0 && (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                overflowY: "auto",
                marginTop: "20px",
              }}
            >
              {userPosts
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((post) => (
                  <div
                    key={post._id}
                    style={{
                      backgroundColor: "#FCFDFE",
                      border: "1px solid #8D88EA",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.2s ease",
                      marginTop: "10px",
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
                        fontSize: "0.8rem",
                        margin: "0 0 0.375rem 0",
                        lineHeight: "1.4",
                      }}
                    >
                      {post.content}
                    </p>
                    <p style={{ color: "#999", fontSize: "0.7rem", margin: "0 0 0.5rem 0" }}>
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
                            : "#F5F7FB",
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
                            e.currentTarget.style.backgroundColor = "#8D88EA";
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
                      <button
                        onClick={() => setOpenCommentModal(post._id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          backgroundColor: openCommentModal === post._id ? "#8D88EA" : "#F5F7FB",
                          color: openCommentModal === post._id ? "#FFFFFF" : "#666",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.4rem 0.8rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                        }}
                        onMouseEnter={(e) => {
                          if (openCommentModal !== post._id) {
                            e.currentTarget.style.backgroundColor = "#8D88EA";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (openCommentModal !== post._id) {
                            e.currentTarget.style.backgroundColor = "#F0F0F5";
                          }
                        }}
                      >
                        <FiMessageCircle size={14} />
                        <span>{post.comments?.length || 0}</span>
                      </button>
                    </div>

                    {post.comments && post.comments.length > 0 && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          paddingTop: "0.5rem",
                          borderTop: "1px solid #8D88EA",
                        }}
                      >
                        <p
                          style={{
                            color: "#666",
                            fontSize: "0.7rem",
                            fontWeight: "600",
                            margin: "0 0 0.375rem 0",
                          }}
                        >
                          Comments ({post.comments.length})
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.375rem",
                          }}
                        >
                          {post.comments.map((comment) => (
                            <div
                              key={comment._id}
                              style={{
                                backgroundColor: "#F9F9FB",
                                padding: "0.4rem",
                                borderRadius: "6px",
                                borderLeft: "3px solid #8D88EA",
                              }}
                            >
                              <p
                                style={{
                                  color: "#1F2340",
                                  fontSize: "0.7rem",
                                  margin: "0 0 0.2rem 0",
                                  lineHeight: "1.3",
                                }}
                              >
                                {comment.content}
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                }}
                              >
                                <p
                                  style={{
                                    color: "#999",
                                    fontSize: "0.6rem",
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
                                      fontSize: "0.6rem",
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
                          marginTop: "0.5rem",
                          paddingTop: "0.5rem",
                          borderTop: "1px solid #8D88EA",
                        }}
                      >
                        <p
                          style={{
                            color: "#999",
                            fontSize: "0.7rem",
                            margin: 0,
                          }}
                        >
                          No comments
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

      {/* Comment Modal */}
      {openCommentModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setOpenCommentModal(null)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: "1.25rem",
                borderBottom: "1px solid #E3E6F5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "1.2rem", margin: 0, color: "#1F2340" }}>
                Comments
              </h2>
              <button
                onClick={() => setOpenCommentModal(null)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                ✕
              </button>
            </div>

            {/* Comments List */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1rem",
              }}
            >
              {(() => {
                const modalPost = userPosts.find((p) => p._id === openCommentModal);
                if (!modalPost || !modalPost.comments || modalPost.comments.length === 0) {
                  return (
                    <p
                      style={{
                        color: "#999",
                        fontSize: "0.875rem",
                        textAlign: "center",
                        padding: "1rem",
                      }}
                    >
                      No comments yet
                    </p>
                  );
                }
                return modalPost.comments.map((comment) => (
                  <div
                    key={comment._id}
                    style={{
                      backgroundColor: "#F9F9FB",
                      padding: "0.8rem",
                      borderRadius: "8px",
                      marginBottom: "0.75rem",
                      borderLeft: "3px solid #8D88EA",
                    }}
                  >
                    <p
                      style={{
                        color: "#1F2340",
                        fontSize: "0.875rem",
                        margin: "0 0 0.4rem 0",
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
                          fontSize: "0.75rem",
                          margin: 0,
                        }}
                      >
                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {comment.likes > 0 && (
                        <span
                          style={{
                            color: "#8D88EA",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                          }}
                        >
                          {comment.likes} {comment.likes === 1 ? "like" : "likes"}
                        </span>
                      )}
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Comment Input */}
            <div
              style={{
                padding: "1rem",
                borderTop: "1px solid #E3E6F5",
              }}
            >
              <textarea
                placeholder="Write a comment..."
                value={commentInputs[openCommentModal] || ""}
                onChange={(e) =>
                  setCommentInputs({
                    ...commentInputs,
                    [openCommentModal]: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #E3E6F5",
                  fontSize: "0.875rem",
                  fontFamily: "'Open Sans', sans-serif",
                  resize: "none",
                  height: "80px",
                  boxSizing: "border-box",
                  fontColor: "#1F2340",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#8D88EA";
                  e.target.style.backgroundColor = "#FFFFFF";
                  e.target.style.boxShadow = "0 0 0 3px rgba(141, 136, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E3E6F5";
                  e.target.style.backgroundColor = "#F6F7FF";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                onClick={() => handleCreateComment(openCommentModal)}
                disabled={
                  creatingComment[openCommentModal] ||
                  !commentInputs[openCommentModal]?.trim()
                }
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  marginTop: "0.75rem",
                  backgroundColor:
                    creatingComment[openCommentModal] ||
                    !commentInputs[openCommentModal]?.trim()
                      ? "#D1D5DB"
                      : "#8D88EA",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor:
                    creatingComment[openCommentModal] ||
                    !commentInputs[openCommentModal]?.trim()
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (
                    !creatingComment[openCommentModal] &&
                    commentInputs[openCommentModal]?.trim()
                  ) {
                    e.currentTarget.style.backgroundColor = "#6E6AB8";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(110, 106, 184, 0.3)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (
                    !creatingComment[openCommentModal] &&
                    commentInputs[openCommentModal]?.trim()
                  ) {
                    e.currentTarget.style.backgroundColor = "#8D88EA";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {creatingComment[openCommentModal] ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;
