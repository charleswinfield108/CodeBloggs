import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { useToast } from "../context/ToastContext";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import AvatarInitials from "../components/AvatarInitials";
import SkeletonLoader from "../components/SkeletonLoader";
import { FiThumbsUp, FiMessageCircle } from "react-icons/fi";

const ContentManager = () => {
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSession();
  const { showToast } = useToast();

  // State
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [deletingPostContent, setDeletingPostContent] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all posts and users
  const fetchPosts = async (page = 1, pageSize = null) => {
    setLoading(true);
    setError(null);
    const startTime = Date.now(); // Track start time for minimum loading duration
    try {
      // Fetch all posts
      const postsResponse = await fetch("http://localhost:5050/posts");
      const postsData = await postsResponse.json();

      if (postsData.status === "ok" && Array.isArray(postsData.data)) {
        let allPosts = postsData.data;

        // Filter by date range if provided
        if (startDate || endDate) {
          allPosts = allPosts.filter((post) => {
            const postDate = new Date(post.createdAt);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start && postDate < start) return false;
            if (end) {
              const endOfDay = new Date(end);
              endOfDay.setHours(23, 59, 59, 999);
              if (postDate > endOfDay) return false;
            }
            return true;
          });
        }

        // Sort posts by creation date - newest first
        allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Calculate pagination
        const total = allPosts.length;
        const size = pageSize || itemsPerPage;
        const skip = (page - 1) * size;
        const paginatedPosts = allPosts.slice(skip, skip + size);

        setPosts(paginatedPosts);
        setTotalPosts(total);
        setCurrentPage(page);

        // Fetch all users for author information
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
    } catch (err) {
      setError(err.message);
      showToast("Error loading posts", "error");
    } finally {
      // Ensure skeleton loaders are visible for at least 400ms
      const elapsedTime = Date.now() - startTime;
      const minimumLoadingTime = 400;
      const remainingDelay = Math.max(0, minimumLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setLoading(false);
      }, remainingDelay);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (session?.auth_level === "admin") {
      fetchPosts();
    }
  }, [session?.auth_level]);

  // Re-fetch when filters change
  useEffect(() => {
    if (session?.auth_level === "admin") {
      setCurrentPage(1);
      fetchPosts(1);
    }
  }, [startDate, endDate]);

  // Check admin access
  useEffect(() => {
    if (!sessionLoading && session?.auth_level !== "admin") {
      navigate("/home", { replace: true });
    }
  }, [session, sessionLoading, navigate]);

  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setItemsPerPage(newSize);
    setCurrentPage(1);
    fetchPosts(1, newSize);
  };

  // Handle delete post
  const handleDeletePost = (postId, postContent) => {
    setDeletingPostId(postId);
    setDeletingPostContent(postContent.substring(0, 50) + "...");
    setIsDeleteModalOpen(true);
  };

  // Confirm delete post
  const handleConfirmDelete = async () => {
    if (!deletingPostId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:5050/post/${deletingPostId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      showToast("Post deleted successfully", "success");
      setIsDeleteModalOpen(false);
      setDeletingPostId(null);
      setDeletingPostContent("");

      // Refresh posts list
      fetchPosts(1);
    } catch (err) {
      showToast(err.message || "Error deleting post", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalPosts / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.25rem 2rem 1rem 2rem", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Sticky Header */}
        <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#FBFCFD", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}>
          <h1 style={{ color: "#8D88EA", marginBottom: "0.75rem", fontSize: "1.5rem", fontWeight: "700" }}>
            Content Manager
          </h1>

          {/* Date Range Search */}
          <div style={{ marginBottom: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" style={{ display: "block", color: "#1F2340", fontSize: "0.75rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  padding: "0.5rem 0.75rem",
                  border: "1px solid #E0E0E0",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" style={{ display: "block", color: "#1F2340", fontSize: "0.75rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  padding: "0.5rem 0.75rem",
                  border: "1px solid #E0E0E0",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Select All Button */}
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setCurrentPage(1);
                fetchPosts(1);
              }}
              style={{
                backgroundColor: "#8D88EA",
                color: "#FFFFFF",
                border: "1px solid #8D88EA",
                borderRadius: "6px",
                padding: "0.5rem 1rem",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#6B65D4";
                e.target.style.borderColor = "#6B65D4";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#8D88EA";
                e.target.style.borderColor = "#8D88EA";
              }}
            >
              Select All
            </button>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setCurrentPage(1);
              }}
              style={{
                backgroundColor: "#F5F5F5",
                color: "#1F2340",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                padding: "0.5rem 1rem",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#E8E8E8";
                e.target.style.borderColor = "#1F2340";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#F5F5F5";
                e.target.style.borderColor = "#E0E0E0";
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingRight: "0.5rem" }}>
          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: "#FADBD8",
              color: "#D32F2F",
              padding: "0.5rem",
              borderRadius: "6px",
              marginBottom: "0.5rem",
              borderLeft: "4px solid #D32F2F",
              fontSize: "0.75rem"
            }}>
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <SkeletonLoader type="post" count={itemsPerPage} />
          )}

          {/* No Posts Message */}
          {!loading && posts.length === 0 && (
            <div style={{
              backgroundColor: "#F6F7FF",
              border: "2px dashed #8D88EA",
              borderRadius: "8px",
              padding: "2rem",
              textAlign: "center",
              marginBottom: "1rem",
            }}>
              <p style={{ color: "#8D88EA", fontSize: "0.875rem", margin: 0 }}>
                {totalPosts === 0 ? "No posts found." : "No posts match your date range."}
              </p>
            </div>
          )}

          {/* Posts List */}
          {posts.map((post) => {
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
                  marginBottom: "1rem",
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

                  {/* Like, Comment, and Delete Buttons */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "auto" }}>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        backgroundColor: "#F0F0F5",
                        color: "#666",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.6rem 1rem",
                        cursor: "default",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                      }}
                    >
                      <FiThumbsUp size={16} />
                      <span>{post.likes || 0} {post.likes === 1 ? "like" : "likes"}</span>
                    </button>

                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        backgroundColor: "#F0F0F5",
                        color: "#666",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.6rem 1rem",
                        cursor: "default",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                      }}
                    >
                      <FiMessageCircle size={16} />
                      <span>{post.comments?.length || 0} {post.comments?.length === 1 ? "comment" : "comments"}</span>
                    </button>

                    <button
                      onClick={() => handleDeletePost(post._id, post.content)}
                      style={{
                        backgroundColor: "#D32F2F",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.6rem 1rem",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        marginLeft: "auto",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#B71C1C";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#D32F2F";
                      }}
                    >
                      Delete Post
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
        {!loading && posts.length > 0 && (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid #E0E0E0",
            fontSize: "0.75rem",
            marginBottom: "1rem"
          }}>
            {/* Numbers */}
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {Array.from({ length: Math.ceil(totalPosts / itemsPerPage) }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => fetchPosts(pageNum)}
                  style={{
                    backgroundColor: currentPage === pageNum ? "#8D88EA" : "#F5F5F5",
                    color: currentPage === pageNum ? "#FFFFFF" : "#1F2340",
                    border: "1px solid #E0E0E0",
                    borderRadius: "4px",
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== pageNum) {
                      e.target.style.backgroundColor = "#E8E8E8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== pageNum) {
                      e.target.style.backgroundColor = "#F5F5F5";
                    }
                  }}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Page Size Dropdown & Info */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <label htmlFor="pageSize" style={{ color: "#1F2340" }}>Posts per page:</label>
              <select
                id="pageSize"
                value={itemsPerPage}
                onChange={handlePageSizeChange}
                style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #E0E0E0",
                  backgroundColor: "#FFFFFF",
                  color: "#1F2340",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
              <span style={{ color: "#666" }}>
                Page {currentPage} of {Math.ceil(totalPosts / itemsPerPage)}
              </span>
            </div>
          </div>
        )}
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          userName={deletingPostContent || "Post"}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isLoading={isDeleting}
        />
      </div>
    </Layout>
  );
};

export default ContentManager;
