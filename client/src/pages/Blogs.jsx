import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSession } from "../context/SessionContext";
import { usePostModal } from "../context/PostModalContext";
import AvatarInitials from "../components/AvatarInitials";
import { FiThumbsUp, FiMessageCircle } from "react-icons/fi";

const Blogs = () => {
  const { session } = useSession();
  const { openModal, registerPostCreatedCallback } = usePostModal();
  const [allPosts, setAllPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});
  const [creatingComment, setCreatingComment] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        // Fetch all posts
        const postsResponse = await fetch("http://localhost:5050/posts");
        const postsData = await postsResponse.json();

        if (postsData.status === "ok" && Array.isArray(postsData.data)) {
          setAllPosts(postsData.data);

          // Fetch all users for author information (with high limit to get all users)
          const usersResponse = await fetch("http://localhost:5050/users?limit=1000");
          const usersData = await usersResponse.json();
          
          if (Array.isArray(usersData.users)) {
            const usersMap = {};
            usersData.users.forEach((user) => {
              usersMap[user._id] = user;
            });
            setUsers(usersMap);
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, [session]);

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
    setAllPosts(
      allPosts.map((post) =>
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
      setAllPosts(
        allPosts.map((post) =>
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
      setAllPosts(
        allPosts.map((post) =>
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

      // Clear the input
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setCreatingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <h2 style={{ color: "#8D88EA", fontSize: "1.25rem", margin: 0 }}>
            All Blogs
          </h2>
          <button
            onClick={() => openModal()}
            style={{
              backgroundColor: "#8D88EA",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#6B65D4";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#8D88EA";
            }}
          >
            + Create Post
          </button>
        </div>

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

        {!loading && allPosts.length > 0 && (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              overflowY: "auto",
              paddingRight: "0.5rem",
              marginTop: "20px",
            }}
          >
            {allPosts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => {
                const author = users[post.user_id];
                return (
                <div
                  key={post._id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #8D88EA",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "10px",
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
                  {/* Left Side - Author Info (20%) */}
                  <div style={{ width: "20%", paddingRight: "1.5rem", borderRight: "1px solid #8D88EA", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    {author && (
                      <>
                        <AvatarInitials
                          firstName={author.first_name}
                          lastName={author.last_name}
                          size={60}
                        />
                        <p style={{ color: "#1F2340", fontSize: "0.9rem", margin: "0.75rem 0 0 0", fontWeight: "600" }}>
                          {author.first_name} {author.last_name}
                        </p>
                        <p style={{ color: "#999", fontSize: "0.75rem", margin: "0.5rem 0 0 0" }}>
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p style={{ color: "#666", fontSize: "0.75rem", margin: "0.5rem 0 0 0" }}>
                          {author.isOnline ? "🟢" : "🔴"} {author.isOnline ? "Online" : "Offline"}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Right Side - Post Content (80%) */}
                  <div style={{ width: "80%", paddingLeft: "1.5rem", display: "flex", flexDirection: "column" }}>
                    {/* Post Content */}
                    <p
                      style={{
                        color: "#1F2340",
                        fontSize: "14px",
                        margin: "0 0 1.5rem 0",
                        lineHeight: "1.6",
                      }}
                    >
                      {post.content}
                    </p>

                    {/* Like and Comment Buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "auto" }}>
                      <button
                        onClick={() => handleLikePost(post._id, post.likes)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          backgroundColor: likedPosts.has(post._id)
                            ? "#8D88EA"
                            : "#F0F0F5",
                          color: likedPosts.has(post._id) ? "#FFFFFF" : "#666",
                          border: "none",
                          borderRadius: "8px",
                          padding: "0.6rem 1rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          fontSize: "0.85rem",
                          fontWeight: "600",
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
                        <FiThumbsUp size={16} />
                        <span>{post.likes} {post.likes === 1 ? "like" : "likes"}</span>
                      </button>

                      <button
                        onClick={() => setOpenCommentModal(post._id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          backgroundColor: "#F0F0F5",
                          color: "#666",
                          border: "none",
                          borderRadius: "8px",
                          padding: "0.6rem 1rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#8D88EA";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#F0F0F5";
                        }}
                      >
                        <FiMessageCircle size={16} />
                        <span>{post.comments?.length || 0} {post.comments?.length === 1 ? "comment" : "comments"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
              })}
          </div>
        )}

        {!loading && allPosts.length === 0 && (
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
              No blogs yet. Be the first to post!
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
            <p style={{ color: "#8D88EA", fontSize: "0.875rem" }}>Loading blogs...</p>
          </div>
        )}
      </div>

      {/* Page-Level Comment Modal */}
      {openCommentModal && (
        (() => {
          const modalPost = allPosts.find((p) => p._id === openCommentModal);
          if (!modalPost) return null;

          return (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
              }}
              onClick={() => setOpenCommentModal(null)}
            >
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "2rem",
                  maxWidth: "500px",
                  width: "90%",
                  maxHeight: "80vh",
                  display: "flex",
                  flexDirection: "column",
                  zIndex: 2001,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <h2 style={{ color: "#1F2340", fontSize: "1.25rem", margin: 0, fontWeight: "600" }}>
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
                      padding: 0,
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Comments List */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    marginBottom: "1rem",
                    borderTop: "1px solid #8D88EA",
                    borderBottom: "1px solid #8D88EA",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                  }}
                >
                  {modalPost.comments && modalPost.comments.length > 0 ? (
                    modalPost.comments.map((comment) => {
                      const commentAuthor = users[comment.user_id];
                      return (
                        <div
                          key={comment._id}
                          style={{
                            backgroundColor: "#F9F9FB",
                            padding: "0.75rem",
                            borderRadius: "8px",
                            marginBottom: "0.75rem",
                            borderLeft: "3px solid #8D88EA",
                          }}
                        >
                          {commentAuthor && (
                            <p style={{ color: "#666", fontSize: "0.75rem", margin: "0 0 0.5rem 0", fontWeight: "600" }}>
                              {commentAuthor.first_name} {commentAuthor.last_name}
                            </p>
                          )}
                          <p
                            style={{
                              color: "#1F2340",
                              fontSize: "0.85rem",
                              margin: 0,
                              lineHeight: "1.4",
                            }}
                          >
                            {comment.content}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: "#999", fontSize: "0.85rem", margin: 0, textAlign: "center" }}>
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>

                {/* Comment Input */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <textarea
                    value={commentInputs[openCommentModal] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [openCommentModal]: e.target.value,
                      }))
                    }
                    placeholder="Add a comment..."
                    style={{
                      width: "100%",
                      minHeight: "80px",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #8D88EA",
                      fontSize: "0.85rem",
                      fontFamily: "inherit",
                      resize: "none",
                    }}
                  />
                  <button
                    onClick={() => handleCreateComment(openCommentModal)}
                    disabled={creatingComment[openCommentModal] || !commentInputs[openCommentModal]?.trim()}
                    style={{
                      backgroundColor:
                        creatingComment[openCommentModal] || !commentInputs[openCommentModal]?.trim()
                          ? "#CCC"
                          : "#8D88EA",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      cursor:
                        creatingComment[openCommentModal] ||
                        !commentInputs[openCommentModal]?.trim()
                          ? "not-allowed"
                          : "pointer",
                      transition: "all 0.2s ease",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        !creatingComment[openCommentModal] &&
                        commentInputs[openCommentModal]?.trim()
                      ) {
                        e.currentTarget.style.backgroundColor = "#7A77D8";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        !creatingComment[openCommentModal] &&
                        commentInputs[openCommentModal]?.trim()
                      ) {
                        e.currentTarget.style.backgroundColor = "#8D88EA";
                      }
                    }}
                  >
                    {creatingComment[openCommentModal] ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      )}
    </Layout>
  );
};

export default Blogs;
