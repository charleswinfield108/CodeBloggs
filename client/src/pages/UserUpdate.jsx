import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import SkeletonLoader from "../components/SkeletonLoader";
import { useSession } from "../context/SessionContext";
import { useToast } from "../context/ToastContext";
import UpdateConfirmationModal from "../components/UpdateConfirmationModal";

const UserUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { session, loading: sessionLoading } = useSession();
  const { showToast } = useToast();

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState(null);
  const [confirmChanges, setConfirmChanges] = useState({});
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [authLevel, setAuthLevel] = useState("basic");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user details
  useEffect(() => {
    // Clear password fields immediately when component mounts or ID changes
    setPassword("");
    setPasswordConfirm("");
    
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5050/user/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const result = await response.json();
        const userData = result.data || result;
        
        // Explicitly remove password if it somehow made it into the response
        delete userData.password;

        setUser(userData);
        setFirstName(userData.first_name || "");
        setLastName(userData.last_name || "");
        setEmail(userData.email || "");
        setOccupation(userData.occupation || "");
        setLocation(userData.location || "");
        setAuthLevel(userData.auth_level || "basic");
        // Ensure password fields are always empty - users must enter new password explicitly
        setPassword("");
        setPasswordConfirm("");

        // Format date for input (YYYY-MM-DD) - check both "birthday" and "birthdate" fields
        const dateValue = userData.birthday || userData.birthdate;
        if (dateValue) {
          let formatted;
          if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Already in YYYY-MM-DD format
            formatted = dateValue;
          } else {
            // Parse as Date and format
            const date = new Date(dateValue);
            formatted = date.toISOString().split("T")[0];
          }
          setBirthdate(formatted);
        }
      } catch (err) {
        setError(err.message);
        showToast("Error loading user", "error");
      } finally {
        setLoading(false);
      }
    };

    if (session?.auth_level === "admin") {
      fetchUser();
    }
  }, [id, session?.auth_level]);

  // Check admin access
  useEffect(() => {
    if (!sessionLoading && session?.auth_level !== "admin") {
      navigate("/home", { replace: true });
    }
  }, [session, sessionLoading, navigate]);

  // Handle save - prepare changes and open confirmation modal
  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      showToast("First Name, Last Name, and Email are required", "error");
      return;
    }

    // Validate passwords if provided
    if (password || passwordConfirm) {
      if (password !== passwordConfirm) {
        showToast("Passwords do not match", "error");
        return;
      }
      if (password.length < 6) {
        showToast("Password must be at least 6 characters", "error");
        return;
      }
    }

    // Prepare update data
    const updateData = {
      first_name: firstName,
      last_name: lastName,
      email,
      occupation,
      location,
      birthdate: birthdate || undefined,  // Send as YYYY-MM-DD string to match database field
      auth_level: authLevel,
    };

    // Only include password if provided
    if (password) {
      updateData.password = password;
    }

    // Prepare display changes
    const changes = {
      "First Name": firstName,
      "Last Name": lastName,
      "Email": email,
      "Occupation": occupation || "(not set)",
      "Location": location || "(not set)",
      "Birthdate": birthdate || "(not set)",
      "Auth Level": authLevel,
      "Password Changed": password ? "Yes" : "No",
    };

    setPendingUpdateData(updateData);
    setConfirmChanges(changes);
    setShowConfirmModal(true);
  };

  // Handle confirm update - actually perform the update
  const handleConfirmUpdate = async () => {
    if (!pendingUpdateData) return;

    setSaving(true);
    try {
      const response = await fetch(`http://localhost:5050/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(pendingUpdateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      showToast("User updated successfully", "success");
      setShowConfirmModal(false);
      navigate("/admin/users");
    } catch (err) {
      showToast(err.message || "Error updating user", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel confirmation modal
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setPendingUpdateData(null);
    setConfirmChanges({});
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/admin/users");
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: "1rem 2rem" }}>
          <SkeletonLoader type="post" count={1} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0.5rem 2rem 2rem 2rem" }}>
        <div style={{ display: "flex", flexDirection: isDesktop ? "row" : "column", alignItems: isDesktop ? "center" : "flex-start", marginBottom: "1rem", justifyContent: "space-between", gap: isDesktop ? "0" : "0.75rem" }}>
          <h1 style={{ color: "#8D88EA", margin: "0", fontSize: isDesktop ? "1.5rem" : "1.25rem", fontWeight: "700" }}>
            Edit User
          </h1>
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: "#8D88EA",
              border: "none",
              color: "#FFFFFF",
              fontSize: "0.9rem",
              cursor: "pointer",
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              marginLeft: isDesktop ? "0.5rem" : "0",
              fontWeight: "600",
              width: isDesktop ? "auto" : "100%",
            }}
          >
            Return to User Manager
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#FADBD8",
              color: "#D32F2F",
              padding: "0.75rem",
              borderRadius: "6px",
              marginBottom: "1rem",
              borderLeft: "4px solid #D32F2F",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              style={{
                display: "block",
                color: "#1F2340",
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              First Name *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              style={{
                display: "block",
                color: "#1F2340",
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Last Name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Email */}
          <div style={{ gridColumn: isDesktop ? "1 / -1" : "auto" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                color: "#1F2340",
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Occupation */}
          <div>
            <label
              htmlFor="occupation"
              style={{
                display: "block",
                color: "#1F2340",
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Occupation
            </label>
            <input
              id="occupation"
              name="occupation"
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              style={{
                display: "block",
                color: "#1F2340",
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Birthdate */}
          <div>
            <label
              htmlFor="birthdate"
              style={{
                display: "block",
                color: "#1F2340",
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Birthdate
            </label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Auth Level */}
          <div>
            <label
              htmlFor="authLevel"
              style={{
                display: "block",
                color: "#1F2340",
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Auth Level
            </label>
            <select
              id="authLevel"
              name="authLevel"
              value={authLevel}
              onChange={(e) => setAuthLevel(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            >
              <option value="basic">Basic</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                color: "#1F2340",
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              New Password (optional)
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                style={{
                  width: "100%",
                  padding: "0.75rem 2.5rem 0.75rem 0.75rem",
                  border: "1px solid #E0E0E0",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "0",
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="passwordConfirm"
              style={{
                display: "block",
                color: "#1F2340",
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Repeat Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Repeat your new password"
                style={{
                  width: "100%",
                  padding: "0.75rem 2.5rem 0.75rem 0.75rem",
                  border: password && passwordConfirm && password !== passwordConfirm ? "1px solid #D32F2F" : "1px solid #E0E0E0",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "0",
                }}
              >
                {showPasswordConfirm ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {password && passwordConfirm && password !== passwordConfirm && (
              <div style={{ color: "#D32F2F", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                Passwords do not match
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ gridColumn: isDesktop ? "1 / -1" : "auto", display: "flex", flexDirection: isDesktop ? "row" : "column", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                backgroundColor: "#8D88EA",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "6px",
                padding: "0.75rem 2rem",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: saving ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
                flex: 1,
                opacity: saving ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!saving) e.target.style.backgroundColor = "#6F6AC0";
              }}
              onMouseLeave={(e) => {
                if (!saving) e.target.style.backgroundColor = "#8D88EA";
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              style={{
                backgroundColor: "#F5F5F5",
                color: "#1F2340",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                padding: "0.75rem 2rem",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: saving ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                flex: 1,
                opacity: saving ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.target.style.backgroundColor = "#E8E8E8";
                  e.target.style.borderColor = "#1F2340";
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.target.style.backgroundColor = "#F5F5F5";
                  e.target.style.borderColor = "#E0E0E0";
                }
              }}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Confirmation Modal */}
        <UpdateConfirmationModal
          isOpen={showConfirmModal}
          userName={user ? `${user.first_name} ${user.last_name}` : "User"}
          changes={confirmChanges}
          onConfirm={handleConfirmUpdate}
          onCancel={handleCancelConfirm}
          isLoading={saving}
        />
      </div>
    </Layout>
  );
};

export default UserUpdate;
