import React from "react";

const DeleteConfirmationModal = ({ 
  isOpen, 
  userName, 
  onConfirm, 
  onCancel, 
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
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
        zIndex: 2000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          padding: "2rem",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2
          style={{
            color: "#1F2340",
            fontSize: "1.25rem",
            fontWeight: "700",
            marginBottom: "1rem",
            margin: "0 0 1rem 0",
          }}
        >
          Delete User
        </h2>

        {/* Message */}
        <p
          style={{
            color: "#666",
            fontSize: "0.95rem",
            marginBottom: "0.5rem",
            margin: "0 0 0.5rem 0",
            lineHeight: "1.5",
          }}
        >
          Are you sure you want to delete <strong>{userName}</strong>?
        </p>

        <p
          style={{
            color: "#D32F2F",
            fontSize: "0.85rem",
            marginBottom: "1.5rem",
            margin: "0 0 1.5rem 0",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          ⚠️ This action cannot be undone.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              backgroundColor: "#F5F5F5",
              color: "#1F2340",
              border: "1px solid #E0E0E0",
              borderRadius: "6px",
              padding: "0.75rem 1.5rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#E8E8E8";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#F5F5F5";
              }
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              backgroundColor: "#D32F2F",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              padding: "0.75rem 1.5rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#B71C1C";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#D32F2F";
              }
            }}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
