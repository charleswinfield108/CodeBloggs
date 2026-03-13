import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import logo from "../assets/CodeBloggs_ logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { login, session, loading } = useSession();

  // Redirect to home if already logged in
  useEffect(() => {
    if (!loading && session) {
      navigate("/home", { replace: true });
    }
  }, [session, loading, navigate]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create abort controller with 10 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch("http://localhost:5050/session/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      login({
        session_token: data.session_token,
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        auth_level: data.auth_level,
        isOnline: data.isOnline,
      });

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#FBFCFD",
        fontFamily: "'Open Sans', sans-serif",
        padding: "0.5rem",
        overflow: "hidden",
      }}>
        {/* Logo Section */}
        <div style={{
          marginBottom: "0.75rem",
          position: "relative",
          top: "-50px",
        }}>
          <img
            src={logo}
            alt="CodeBloggs Logo"
            style={{
              height: "40px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Form container */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}>
          {/* Sign In Form Card - Styled like User Manager Card */}
          <div style={{
            width: "100%",
            maxWidth: "375px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #8D88EA",
            borderRadius: "12px",
            padding: "calc(0.88rem + 15px)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            transition: "all 0.3s ease",
            maxHeight: "85vh",
            overflowY: "auto",
          }}>
          {/* Welcome Section Inside Card */}
          <div style={{
            textAlign: "center",
            marginBottom: "0.55rem",
          }}>
            <h1 style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "0.2rem",
              color: "#8D88EA",
              lineHeight: "1.2",
              margin: "0 0 0.15rem 0",
            }}>
              Please Login
            </h1>
            <p style={{
              fontSize: "0.8rem",
              fontWeight: "400",
              color: "#666",
              marginBottom: 0,
              lineHeight: "1.4",
            }}>
              Sign in to your account and continue the conversation
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "0.55rem" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: "#1F2340",
                  marginBottom: "0.4rem",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                style={{
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  border: "1px solid #E3E6F5",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontFamily: "'Open Sans', sans-serif",
                  boxSizing: "border-box",
                  color: "#1F2340",
                  backgroundColor: "#F6F7FF",
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#8D88EA";
                  e.target.style.backgroundColor = "#FFFFFF";
                  e.target.style.boxShadow = "0 0 0 3px rgba(141, 136, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E3E6F5";
                  e.target.style.backgroundColor = "#F6F7FF";
                  e.target.style.boxShadow = "none";
                }}
                disabled={isSubmitting}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "0.55rem" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: "#1F2340",
                  marginBottom: "0.4rem",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    paddingRight: "2.5rem",
                    border: "1px solid #E3E6F5",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontFamily: "'Open Sans', sans-serif",
                    boxSizing: "border-box",
                    color: "#1F2340",
                    backgroundColor: "#F6F7FF",
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8D88EA";
                    e.target.style.backgroundColor = "#FFFFFF";
                    e.target.style.boxShadow = "0 0 0 3px rgba(141, 136, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E3E6F5";
                    e.target.style.backgroundColor = "#F6F7FF";
                    e.target.style.boxShadow = "none";
                  }}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontSize: "1.1rem",
                    color: "#8D88EA",
                    padding: "0.4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isSubmitting ? "0.5" : "1",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => !isSubmitting && (e.target.style.color = "#6E6AB8")}
                  onMouseLeave={(e) => !isSubmitting && (e.target.style.color = "#8D88EA")}
                  disabled={isSubmitting}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                marginBottom: "0.55rem",
                padding: "0.66rem 0.88rem",
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}>
                <span style={{ fontSize: "1.2rem" }}>⚠️</span>
                <p style={{
                  color: "#B91C1C",
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  margin: 0,
                  flex: 1,
                }}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                backgroundColor: isSubmitting ? "#B1ADFF" : "#8D88EA",
                color: "white",
                fontWeight: "600",
                padding: "0.715rem 1rem",
                marginTop: "0.44rem",
                borderRadius: "8px",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                fontFamily: "'Open Sans', sans-serif",
                boxSizing: "border-box",
                boxShadow: "0 2px 8px rgba(141, 136, 234, 0.2)",
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = "#6E6AB8", e.currentTarget.style.boxShadow = "0 4px 12px rgba(110, 106, 184, 0.3)", e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = "#8D88EA", e.currentTarget.style.boxShadow = "0 2px 8px rgba(141, 136, 234, 0.2)", e.currentTarget.style.transform = "translateY(0)")}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            {/* Footer Link */}
            <p style={{
              textAlign: "center",
              color: "#666",
              fontSize: "0.8rem",
              fontWeight: "400",
              marginTop: "0.55rem",
              marginBottom: 0,
            }}>
              Not a member?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                style={{
                  color: "#8D88EA",
                  fontWeight: "600",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  transition: "all 0.2s ease",
                  padding: "0",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#6E6AB8", e.target.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.target.style.color = "#8D88EA", e.target.style.textDecoration = "none")}
              >
                Register now
              </button>
            </p>
          </form>
        </div>
        </div>
      </div>
    </>
  );
};

export default Login;
