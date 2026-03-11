import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSession } from "../context/SessionContext";
import AvatarInitials from "../components/AvatarInitials";
import { FiThumbsUp } from "react-icons/fi";

const Blogs = () => {
  const { session } = useSession();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});
  const [creatingComment, setCreatingComment] = useState({});

  useEffect(() => {
    const fetchUserPosts = async () => {
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
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [session?.id]);

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
        <h2 style={{ color: "#1F2340", fontSize: "1.25rem", margin: "0 0 0.75rem 0" }}>
          My Blogs
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

        {!loading && userPosts.length > 0 && (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "1.5rem",
              overflowY: "auto",
              paddingRight: "0.5rem",
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
                  {/* Author Avatar Section */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <AvatarInitials
                      firstName={session?.first_name}
                      lastName={session?.last_name}
                      size={40}
                    />
                    <div>
                      <p style={{ color: "#1F2340", fontSize: "0.85rem", margin: 0, fontWeight: "600" }}>
                        {session?.first_name} {session?.last_name}
                      </p>
                      <p style={{ color: "#999", fontSize: "0.7rem", margin: 0 }}>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: "1px", backgroundColor: "#E3E6F5", marginBottom: "1rem" }} />

                  {/* Post Date */}
                  <p style={{ color: "#999", fontSize: "0.7rem", margin: "0 0 0.75rem 0", fontWeight: "500" }}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {/* Post Content */}
                  <p
                    style={{
                      color: "#1F2340",
                      fontSize: "1rem",
                      margin: "0 0 1rem 0",
                      lineHeight: "1.6",
                      flex: 1,
                    }}
                  >
                    {post.content}
                  </p>

                  {/* Like Button */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
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
                          e.currentTarget.style.backgroundColor = "#E3E6F5";
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
                  </div>

                  {/* Comments Section */}
                  {post.comments && post.comments.length > 0 && (
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
                        Comments ({post.comments.length})
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        {post.comments.map((comment) => (
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
                                gap: "0.5rem",
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
                                    fontWeight: "600",
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

                  {/* Comment Input Section */}
                  <div
                    style={{
                      borderTop: "1px solid #E3E6F5",
                      paddingTop: "1rem",
                    }}
                  >
                    {(!post.comments || post.comments.length === 0) && (
                      <p
                        style={{
                          color: "#999",
                          fontSize: "0.8rem",
                          margin: "0 0 1rem 0",
                        }}
                      >
                        No comments yet
                      </p>
                    )}
                    <textarea
                      value={commentInputs[post._id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      placeholder="Add a comment..."
                      style={{
                        width: "100%",
                        minHeight: "60px",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #E3E6F5",
                        fontSize: "0.85rem",
                        fontFamily: "inherit",
                        resize: "none",
                        marginBottom: "0.75rem",
                      }}
                    />
                    <button
                      onClick={() => handleCreateComment(post._id)}
                      disabled={creatingComment[post._id] || !commentInputs[post._id]?.trim()}
                      style={{
                        width: "100%",
                        backgroundColor:
                          creatingComment[post._id] || !commentInputs[post._id]?.trim()
                            ? "#CCC"
                            : "#8D88EA",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.6rem 1rem",
                        cursor:
                          creatingComment[post._id] ||
                          !commentInputs[post._id]?.trim()
                            ? "not-allowed"
                            : "pointer",
                        transition: "all 0.2s ease",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                      }}
                      onMouseEnter={(e) => {
                        if (
                          !creatingComment[post._id] &&
                          commentInputs[post._id]?.trim()
                        ) {
                          e.currentTarget.style.backgroundColor = "#7A77D8";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (
                          !creatingComment[post._id] &&
                          commentInputs[post._id]?.trim()
                        ) {
                          e.currentTarget.style.backgroundColor = "#8D88EA";
                        }
                      }}
                    >
                      {creatingComment[post._id] ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
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
              No blogs yet. Click "Post" to create one!
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
    </Layout>
  );
};

export default Blogs;
