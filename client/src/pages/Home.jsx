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

        {!loading && userPosts.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h2 style={{ color: "#1F2340", fontSize: "1.5rem", marginBottom: "1rem" }}>
              Your Recent Posts
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {userPosts
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((post) => (
                  <div
                    key={post._id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E3E6F5",
                      borderRadius: "8px",
                      padding: "1.5rem",
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
                    <p style={{ color: "#1F2340", fontSize: "1rem", margin: "0 0 0.5rem 0", lineHeight: "1.6" }}>
                      {post.content}
                    </p>
                    <p style={{ color: "#999", fontSize: "0.875rem", margin: "0 0 1rem 0" }}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <button
                        onClick={() => handleLikePost(post._id, post.likes)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          backgroundColor: likedPosts.has(post._id) ? "#8D88EA" : "#F0F0F5",
                          color: likedPosts.has(post._id) ? "#FFFFFF" : "#666",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.5rem 1rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          fontSize: "0.875rem",
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
                        <FiThumbsUp size={16} />
                        <span>{post.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!loading && userPosts.length === 0 && (
          <div
            style={{
              marginTop: "2rem",
              backgroundColor: "#F6F7FF",
              border: "2px dashed #8D88EA",
              borderRadius: "8px",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#8D88EA", fontSize: "1rem", margin: 0 }}>
              You haven't created any posts yet. Click the "Post" button in the header to share your first post!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
