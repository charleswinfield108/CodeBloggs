import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { useSession } from "../context/SessionContext";
import { useToast } from "../context/ToastContext";

const UserManager = () => {
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSession();
  const { showToast } = useToast();

  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sortBy, setSortBy] = useState(null); // 'first_name' or 'last_name'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [deletingUserName, setDeletingUserName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users from backend
  const fetchUsers = async (page = 1, fname = firstName, lname = lastName, pageSize = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", pageSize || itemsPerPage);
      if (fname) params.append("firstName", fname);
      if (lname) params.append("lastName", lname);

      const response = await fetch(`http://localhost:5050/users?${params.toString()}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      let fetchedUsers = data.users || [];

      // Apply sorting if set
      if (sortBy) {
        fetchedUsers.sort((a, b) => {
          const aVal = a[sortBy].toLowerCase();
          const bVal = b[sortBy].toLowerCase();
          return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });
      }

      setUsers(fetchedUsers);
      setTotalUsers(data.total || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      showToast("Error loading users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Handle edit user
  const handleEditUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  // Handle delete user
  const handleOpenDeleteModal = (userId, userName) => {
    setDeletingUserId(userId);
    setDeletingUserName(userName);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingUserId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:5050/user/${deletingUserId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      showToast("User deleted successfully", "success");
      setIsDeleteModalOpen(false);
      setDeletingUserId(null);
      setDeletingUserName("");
      fetchUsers(currentPage, firstName, lastName);
    } catch (err) {
      showToast(err.message || "Error deleting user", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to page 1
    fetchUsers(1, firstName, lastName, newSize);
  };

  // Update fetchUsers to accept itemsPerPage parameter
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingUserId(null);
    setDeletingUserName("");
  };

  // Auto-filter as user types
  useEffect(() => {
    if (session?.auth_level === "admin") {
      setCurrentPage(1);
      fetchUsers(1, firstName, lastName);
    }
  }, [firstName, lastName, sortBy, sortOrder]);

  // Handle clear filters
  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setCurrentPage(1);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      fetchUsers(1, "", "");
    }, 300);
  };

  // Fetch users on component mount
  useEffect(() => {
    if (session?.auth_level === "admin") {
      fetchUsers(1, "", "");
    }
  }, [session?.auth_level]);

  // Check admin access
  useEffect(() => {
    if (!sessionLoading && session?.auth_level !== "admin") {
      navigate("/home", { replace: true });
    }
  }, [session, sessionLoading, navigate]);

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.25rem 2rem 1rem 2rem" }}>
        <h1 style={{ color: "#8D88EA", marginBottom: "0.75rem", fontSize: "1.5rem", fontWeight: "700" }}>
          User Manager
        </h1>

        {/* Search Section */}
        <div style={{ marginBottom: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
          {/* First Name Search */}
          <div style={{ flex: 1 }}>
            <label htmlFor="firstName" style={{ display: "block", color: "#1F2340", fontSize: "0.75rem", fontWeight: "600", marginBottom: "0.25rem" }}>
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Type to search..."
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                fontSize: "0.8rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Last Name Search */}
          <div style={{ flex: 1 }}>
            <label htmlFor="lastName" style={{ display: "block", color: "#1F2340", fontSize: "0.75rem", fontWeight: "600", marginBottom: "0.25rem" }}>
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Type to search..."
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                fontSize: "0.8rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={() => {
              setCurrentPage(1);
              fetchUsers(1, firstName, lastName);
            }}
            style={{
              backgroundColor: "#8D88EA",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              fontSize: "0.75rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#6F6AC0";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#8D88EA";
            }}
          >
            Search
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClear}
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
          <div style={{
            backgroundColor: "#D6EAF8",
            color: "#3498DB",
            padding: "0.5rem",
            borderRadius: "6px",
            marginBottom: "0.5rem",
            borderLeft: "4px solid #3498DB",
            fontSize: "0.75rem"
          }}>
            Loading users...
          </div>
        )}

        {/* Sort Buttons & Results Per Page */}
        {!loading && users.length > 0 && (
          <div style={{ marginBottom: "0.5rem", display: "flex", gap: "0.35rem", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
              <span style={{ color: "#1F2340", fontSize: "0.7rem", fontWeight: "600", alignSelf: "center" }}>Sort:</span>
              <button
                onClick={() => handleSort("first_name")}
                style={{
                  backgroundColor: sortBy === "first_name" ? "#8D88EA" : "#F5F5F5",
                  color: sortBy === "first_name" ? "#FFFFFF" : "#1F2340",
                  border: "1px solid #E0E0E0",
                  borderRadius: "6px",
                  padding: "0.35rem 0.7rem",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (sortBy !== "first_name") {
                    e.target.style.backgroundColor = "#E8E8E8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (sortBy !== "first_name") {
                    e.target.style.backgroundColor = "#F5F5F5";
                  }
                }}
              >
                First Name {sortBy === "first_name" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => handleSort("last_name")}
                style={{
                  backgroundColor: sortBy === "last_name" ? "#8D88EA" : "#F5F5F5",
                  color: sortBy === "last_name" ? "#FFFFFF" : "#1F2340",
                  border: "1px solid #E0E0E0",
                  borderRadius: "6px",
                  padding: "0.35rem 0.7rem",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (sortBy !== "last_name") {
                    e.target.style.backgroundColor = "#E8E8E8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (sortBy !== "last_name") {
                    e.target.style.backgroundColor = "#F5F5F5";
                  }
                }}
              >
                Last Name {sortBy === "last_name" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <label htmlFor="pageSize" style={{ color: "#1F2340", fontSize: "0.7rem", fontWeight: "600" }}>
                Show:
              </label>
              <select
                id="pageSize"
                value={itemsPerPage}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                style={{
                  backgroundColor: "#F5F5F5",
                  color: "#1F2340",
                  border: "1px solid #E0E0E0",
                  borderRadius: "4px",
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
              <span style={{ color: "#1F2340", fontSize: "0.7rem", fontWeight: "600" }}>users</span>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div style={{ overflowX: "auto", marginBottom: "0.75rem" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#FFFFFF",
              fontSize: "0.7rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#F6F7FF", borderBottom: "2px solid #8D88EA" }}>
                <th style={{ padding: "0.35rem 0.5rem", textAlign: "left", color: "#1F2340", fontWeight: "700", fontSize: "0.7rem" }}>
                  First Name
                </th>
                <th style={{ padding: "0.35rem 0.5rem", textAlign: "left", color: "#1F2340", fontWeight: "700", fontSize: "0.7rem" }}>
                  Last Name
                </th>
                <th style={{ padding: "0.35rem 0.5rem", textAlign: "center", color: "#1F2340", fontWeight: "700", fontSize: "0.7rem" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading && users.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: "1rem", textAlign: "center", color: "#666", fontSize: "0.7rem" }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    style={{
                      borderBottom: "1px solid #E0E0E0",
                      backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9F9FB",
                    }}
                  >
                    <td style={{ padding: "0.35rem 0.5rem", color: "#1F2340", fontSize: "0.7rem" }}>
                      {user.first_name}
                    </td>
                    <td style={{ padding: "0.35rem 0.5rem", color: "#1F2340", fontSize: "0.7rem" }}>
                      {user.last_name}
                    </td>
                    <td style={{ padding: "0.35rem 0.5rem", fontSize: "0.7rem", textAlign: "center", display: "flex", gap: "0.3rem", justifyContent: "center" }}>
                      <button
                        onClick={() => handleEditUser(user._id)}
                        style={{
                          backgroundColor: "#8D88EA",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.65rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#6F6AC0")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#8D88EA")}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(user._id, `${user.first_name} ${user.last_name}`)}
                        style={{
                          backgroundColor: "#D32F2F",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.65rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#B71C1C")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#D32F2F")}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "0.25rem",
            marginTop: "0.5rem",
            paddingTop: "0.5rem",
            borderTop: "1px solid #E0E0E0",
          }}>
            {/* Previous Button */}
            <button
              onClick={() => fetchUsers(currentPage - 1, firstName, lastName)}
              disabled={currentPage === 1}
              style={{
                backgroundColor: currentPage === 1 ? "#E8E8E8" : "#8D88EA",
                color: currentPage === 1 ? "#999" : "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "0.25rem 0.5rem",
                fontSize: "0.65rem",
                fontWeight: "600",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (currentPage > 1) e.target.style.backgroundColor = "#6F6AC0";
              }}
              onMouseLeave={(e) => {
                if (currentPage > 1) e.target.style.backgroundColor = "#8D88EA";
              }}
            >
              ← Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.ceil(totalUsers / itemsPerPage) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchUsers(page, firstName, lastName)}
                style={{
                  backgroundColor: page === currentPage ? "#8D88EA" : "#F5F5F5",
                  color: page === currentPage ? "#FFFFFF" : "#1F2340",
                  border: "1px solid #E0E0E0",
                  borderRadius: "4px",
                  padding: "0.25rem 0.4rem",
                  fontSize: "0.65rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  minWidth: "1.5rem",
                }}
                onMouseEnter={(e) => {
                  if (page !== currentPage) e.target.style.backgroundColor = "#E8E8E8";
                }}
                onMouseLeave={(e) => {
                  if (page !== currentPage) e.target.style.backgroundColor = "#F5F5F5";
                }}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => fetchUsers(currentPage + 1, firstName, lastName)}
              disabled={currentPage === Math.ceil(totalUsers / itemsPerPage)}
              style={{
                backgroundColor: currentPage === Math.ceil(totalUsers / itemsPerPage) ? "#E8E8E8" : "#8D88EA",
                color: currentPage === Math.ceil(totalUsers / itemsPerPage) ? "#999" : "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "0.25rem 0.5rem",
                fontSize: "0.65rem",
                fontWeight: "600",
                cursor: currentPage === Math.ceil(totalUsers / itemsPerPage) ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (currentPage < Math.ceil(totalUsers / itemsPerPage)) e.target.style.backgroundColor = "#6F6AC0";
              }}
              onMouseLeave={(e) => {
                if (currentPage < Math.ceil(totalUsers / itemsPerPage)) e.target.style.backgroundColor = "#8D88EA";
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {!loading && users.length > 0 && (
          <div style={{ color: "#666", fontSize: "0.65rem", textAlign: "center", marginTop: "0.35rem" }}>
            <p style={{ margin: "0" }}>
              Page {currentPage} of {Math.ceil(totalUsers / itemsPerPage)} • {users.length} of {totalUsers} users
            </p>
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        userName={deletingUserName}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </Layout>
  );
};

export default UserManager;

