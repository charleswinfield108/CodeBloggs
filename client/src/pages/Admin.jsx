import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useSession } from "../context/SessionContext";
import { MdPeople } from "react-icons/md";
import { MdContentPaste } from "react-icons/md";

const Admin = () => {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if user is admin
  useEffect(() => {
    if (!loading && session?.auth_level !== "admin") {
      navigate("/home", { replace: true });
    }
  }, [session, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <p style={{ color: "#8D88EA", fontSize: "0.875rem" }}>Loading...</p>
        </div>
      </Layout>
    );
  }

  // Don't render if not admin (will redirect)
  if (session?.auth_level !== "admin") {
    return null;
  }

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        <h2 style={{ color: "#8D88EA", fontSize: "1.25rem", margin: "0 0 0.5rem 0" }}>
          Admin Dashboard
        </h2>
        <p style={{ color: "#666", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
          Community Management and Moderation Tools
        </p>

        {/* Management Cards Grid */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: isDesktop ? "repeat(auto-fit, minmax(400px, 1fr))" : "1fr",
            gap: "2rem",
            overflowY: "auto",
            paddingRight: "0.5rem",
            paddingTop: "1rem",
            marginTop: "15px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          {/* User Manager Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #8D88EA",
              borderRadius: "12px",
              padding: "2rem",
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
            {/* Card Icon and Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#F0F0F5",
                  borderRadius: "12px",
                }}
              >
                <MdPeople size={32} color="#8D88EA" />
              </div>
              <h3 style={{ color: "#1F2340", fontSize: "1.125rem", margin: 0, fontWeight: "700" }}>
                User Manager
              </h3>
            </div>

            {/* Card Description */}
            <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: "1.6", margin: "0 0 1.5rem 0" }}>
              Manage users, roles, and permissions. Monitor user accounts, handle moderation actions, and maintain platform security.
            </p>

            {/* Button */}
            <button
              onClick={() => navigate("/admin/users")}
              style={{
                backgroundColor: "#8D88EA",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1.5rem",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                alignSelf: "flex-start",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#7B77D8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#8D88EA";
              }}
            >
              Open User Manager
            </button>
          </div>

          {/* Content Manager Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #8D88EA",
              borderRadius: "12px",
              padding: "2rem",
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
            {/* Card Icon and Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#F0F0F5",
                  borderRadius: "12px",
                }}
              >
                <MdContentPaste size={32} color="#8D88EA" />
              </div>
              <h3 style={{ color: "#1F2340", fontSize: "1.125rem", margin: 0, fontWeight: "700" }}>
                Content Manager
              </h3>
            </div>

            {/* Card Description */}
            <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: "1.6", margin: "0 0 1.5rem 0" }}>
              Moderate posts, comments, and reports. Review flagged content, manage community guidelines, and ensure platform safety.
            </p>

            {/* Button */}
            <button
              onClick={() => navigate("/admin/posts")}
              style={{
                backgroundColor: "#8D88EA",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1.5rem",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                alignSelf: "flex-start",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#7B77D8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#8D88EA";
              }}
            >
              Open Content Manager
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
