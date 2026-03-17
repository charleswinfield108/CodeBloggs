import React from "react";

const UpdateConfirmationModal = ({ 
  isOpen, 
  userName, 
  changes, 
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
          Confirm Update
        </h2>

        {/* Message */}
        <p
          style={{
            color: "#666",
            fontSize: "0.95rem",
            marginBottom: "1.5rem",
            margin: "0 0 1.5rem 0",
            lineHeight: "1.5",
          }}
        >
          Review the changes you're about to make for <strong>{userName}</strong>:
        </p>

        {/* Changes List */}
        <div
          style={{
            backgroundColor: "#F9F9F9",
            border: "1px solid #E0E0E0",
            borderRadius: "6px",
            padding: "1rem",
            marginBottom: "1.5rem",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {Object.entries(changes).map(([key, value]) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid #E8E8E8",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ color: "#1F2340", fontWeight: "600" }}>
                {key}:
              </span>
              <span style={{ color: "#666" }}>
                {value === null || value === undefined || value === "" 
                  ? "(empty)" 
                  : String(value)}
              </span>
            </div>
          ))}
        </div>

        {/* Warning if password is being changed */}
        {changes["Password Changed"] === "Yes" && (
          <p
            style={{
              color: "#8D88EA",
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
              margin: "0 0 1.5rem 0",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            ℹ️ Password will be updated.
          </p>
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
              backgroundColor: "#8D88EA",
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
                e.target.style.backgroundColor = "#6C63C9";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#8D88EA";
              }
            }}
          >
            {isLoading ? "Updating..." : "Confirm Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateConfirmationModal;
