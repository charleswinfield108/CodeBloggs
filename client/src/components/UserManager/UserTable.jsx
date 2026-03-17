import React from "react";
import { useNavigate } from "react-router-dom";

const UserTable = ({ users, onDelete, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#8D88EA" }}>
        <p>Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
        <p>No users found.</p>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#FFFFFF",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#F6F7FF", borderBottom: "2px solid #8D88EA" }}>
            <th style={{ padding: "1rem", textAlign: "left", color: "#1F2340", fontWeight: "700", fontSize: "0.875rem" }}>
              First Name
            </th>
            <th style={{ padding: "1rem", textAlign: "left", color: "#1F2340", fontWeight: "700", fontSize: "0.875rem" }}>
              Last Name
            </th>
            <th style={{ padding: "1rem", textAlign: "left", color: "#1F2340", fontWeight: "700", fontSize: "0.875rem" }}>
              Email
            </th>
            <th style={{ padding: "1rem", textAlign: "left", color: "#1F2340", fontWeight: "700", fontSize: "0.875rem" }}>
              Occupation
            </th>
            <th style={{ padding: "1rem", textAlign: "left", color: "#1F2340", fontWeight: "700", fontSize: "0.875rem" }}>
              Location
            </th>
            <th style={{ padding: "1rem", textAlign: "left", color: "#1F2340", fontWeight: "700", fontSize: "0.875rem" }}>
              Birthdate
            </th>
            <th style={{ padding: "1rem", textAlign: "left", color: "#1F2340", fontWeight: "700", fontSize: "0.875rem" }}>
              Auth Level
            </th>
            <th style={{ padding: "1rem", textAlign: "center", color: "#1F2340", fontWeight: "700", fontSize: "0.875rem" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user._id}
              style={{
                borderBottom: "1px solid #E0E0E0",
                backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9FB",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F0F0F5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#FFFFFF" : "#F9F9FB";
              }}
            >
              <td style={{ padding: "1rem", color: "#1F2340", fontSize: "0.9rem" }}>{user.first_name}</td>
              <td style={{ padding: "1rem", color: "#1F2340", fontSize: "0.9rem" }}>{user.last_name}</td>
              <td style={{ padding: "1rem", color: "#1F2340", fontSize: "0.9rem" }}>{user.email}</td>
              <td style={{ padding: "1rem", color: "#666", fontSize: "0.9rem" }}>{user.occupation || "N/A"}</td>
              <td style={{ padding: "1rem", color: "#666", fontSize: "0.9rem" }}>{user.location || "N/A"}</td>
              <td style={{ padding: "1rem", color: "#666", fontSize: "0.9rem" }}>{formatDate(user.birthdate)}</td>
              <td style={{ padding: "1rem", color: "#1F2340", fontSize: "0.9rem" }}>
                <span
                  style={{
                    backgroundColor: user.auth_level === "admin" ? "#FFE5E5" : "#E5F2FF",
                    color: user.auth_level === "admin" ? "#D32F2F" : "#1976D2",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  {user.auth_level}
                </span>
              </td>
              <td
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                {/* Edit Button */}
                <button
                  onClick={() => navigate(`/admin/users/${user._id}`)}
                  style={{
                    backgroundColor: "#8D88EA",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.5rem 0.75rem",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#7B77D8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#8D88EA";
                  }}
                  title="Edit user"
                >
                  ✎ Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => onDelete(user)}
                  style={{
                    backgroundColor: "#D32F2F",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.5rem 0.75rem",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#B71C1C";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#D32F2F";
                  }}
                  title="Delete user"
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
