import React, { useState } from "react";
import { usePostModal } from "../context/PostModalContext";
import { useSession } from "../context/SessionContext";

const PostModal = () => {
  const { isOpen, closeModal } = usePostModal();
  const { session } = useSession();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5050/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          user_id: session?.id,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create post");
      }

      setContent("");
      closeModal();
      // TODO: Trigger a refresh of posts or show success message
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setContent("");
    setError("");
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay (Background) */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 2000,
        }}
      />

      {/* Modal Content */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "2rem",
          width: "90%",
          maxWidth: "500px",
          zIndex: 2001,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              color: "#1F2340",
              fontWeight: "600",
            }}
          >
            Create a Post
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#999",
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          style={{
            width: "100%",
            height: "120px",
            padding: "1rem",
            border: "1px solid #E3E6F5",
            borderRadius: "8px",
            fontSize: "1rem",
            fontFamily: "inherit",
            resize: "none",
            boxSizing: "border-box",
            marginBottom: "1rem",
          }}
        />

        {/* Error Message */}
        {error && (
          <div
            style={{
              color: "#E74C3C",
              fontSize: "0.9rem",
              marginBottom: "1rem",
              padding: "0.75rem",
              backgroundColor: "#FADBD8",
              borderRadius: "6px",
            }}
          >
            {error}
          </div>
        )}

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleClose}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#F0F0F5",
              color: "#1F2340",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E8E8EF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F0F0F5";
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: loading ? "#B8B3D9" : "#8D88EA",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#7A75D6";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#8D88EA";
            }}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </>
  );
};

export default PostModal;
