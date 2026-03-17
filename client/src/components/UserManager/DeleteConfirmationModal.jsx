import React from "react";

const DeleteConfirmationModal = ({ isOpen, user, onConfirm, onCancel, isLoading }) => {
  if (!isOpen || !user) return null;

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
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          padding: "2rem",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: "#D32F2F", fontSize: "1.25rem", margin: "0 0 1rem 0", fontWeight: "700" }}>
          Delete User?
        </h3>

        <div style={{ marginBottom: "1.5rem", color: "#666", fontSize: "0.9rem", lineHeight: "1.6" }}>
          <p style={{ margin: "0 0 0.5rem 0" }}>
            Are you sure you want to delete <strong>{user.first_name} {user.last_name}</strong>?
          </p>
          <p style={{ margin: "0.5rem 0", color: "#999", fontSize: "0.85rem" }}>
            Email: {user.email}
          </p>
          <p style={{ margin: "1rem 0 0 0", color: "#D32F2F", fontWeight: "600" }}>
            This action cannot be undone.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
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
              opacity: isLoading ? 0.6 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#E8E8E8";
                e.currentTarget.style.borderColor = "#8D88EA";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#F5F5F5";
                e.currentTarget.style.borderColor = "#E0E0E0";
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
              opacity: isLoading ? 0.6 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#B71C1C";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#D32F2F";
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
