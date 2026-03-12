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
      minHeight: "100vh",
      display: "flex",
      background: "#FFFFFF",
      fontFamily: "'Open Sans', sans-serif",
    }}>
      {/* Left Side - Illustration & Hero Section */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "3rem 2rem",
        background: "linear-gradient(135deg, #B1ADFF 0%, #8D88EA 50%, #6E6AB8 100%)",
        color: "white",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative floating elements */}
        <div style={{
          position: "absolute",
          width: "120px",
          height: "120px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
          top: "10%",
          left: "10%",
          animation: "float 6s ease-in-out infinite",
        }}></div>
        <div style={{
          position: "absolute",
          width: "80px",
          height: "80px",
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          bottom: "20%",
          right: "10%",
          animation: "float 8s ease-in-out infinite",
        }}></div>

        {/* Logo and branding */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <img
            src={logo}
            alt="CodeBloggs Logo"
            style={{
              height: "50px",
              marginBottom: "2rem",
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>

        {/* Center illustration placeholder */}
        <div style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "400px",
        }}>
          <div style={{
            width: "180px",
            height: "200px",
            background: "rgba(255, 255, 255, 0.15)",
            borderRadius: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "2rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
            <div style={{
              fontSize: "80px",
              opacity: "0.6",
            }}>💻</div>
          </div>
          <h1 style={{
            fontSize: "2.2rem",
            fontWeight: "700",
            marginBottom: "0.75rem",
            lineHeight: "1.3",
            color: "white",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}>
            Welcome Back!
          </h1>
          <p style={{
            fontSize: "1rem",
            fontWeight: "300",
            marginBottom: "1.5rem",
            opacity: "0.95",
            lineHeight: "1.5",
            color: "rgba(255, 255, 255, 0.95)",
          }}>
            Continue sharing your code and connecting with developers
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#FFFFFF",
        minHeight: "100vh",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{
              fontSize: "0.85rem",
              color: "#8D88EA",
              fontWeight: "600",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              Welcome
            </p>
            <h2 style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#403E6B",
              marginBottom: "0.75rem",
              lineHeight: "1.3",
            }}>
              Hello Again!
            </h2>
            <p style={{
              fontSize: "0.95rem",
              color: "#6B7280",
              fontWeight: "400",
              lineHeight: "1.5",
            }}>
              We missed you. Sign in to your account and start sharing your journey.
            </p>
          </div>

          {/* Form Card */}
          <div style={{
            background: "#FFFFFF",
          }}>
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: "1.2rem" }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#403E6B",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
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
                  placeholder="john@example.com"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #E5E7EB",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontFamily: "'Open Sans', sans-serif",
                    boxSizing: "border-box",
                    color: "#403E6B",
                    backgroundColor: "#F9FAFB",
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8D88EA";
                    e.target.style.backgroundColor = "#FFFFFF";
                    e.target.style.boxShadow = "0 0 0 4px rgba(141, 136, 234, 0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E5E7EB";
                    e.target.style.backgroundColor = "#F9FAFB";
                    e.target.style.boxShadow = "none";
                  }}
                  disabled={isSubmitting}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#403E6B",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
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
                      padding: "0.75rem 1rem",
                      paddingRight: "2.8rem",
                      border: "2px solid #E5E7EB",
                      borderRadius: "10px",
                      fontSize: "0.95rem",
                      fontFamily: "'Open Sans', sans-serif",
                      boxSizing: "border-box",
                      color: "#403E6B",
                      backgroundColor: "#F9FAFB",
                      transition: "all 0.3s ease",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8D88EA";
                      e.target.style.backgroundColor = "#FFFFFF";
                      e.target.style.boxShadow = "0 0 0 4px rgba(141, 136, 234, 0.08)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E5E7EB";
                      e.target.style.backgroundColor = "#F9FAFB";
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
                  marginBottom: "1.2rem",
                  padding: "0.875rem 1rem",
                  backgroundColor: "#FEF2F2",
                  border: "2px solid #FECACA",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}>
                  <span style={{ fontSize: "1.2rem" }}>⚠️</span>
                  <p style={{
                    color: "#B91C1C",
                    fontSize: "0.875rem",
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
                  backgroundColor: isSubmitting ? "#D1C4F7" : "#8D88EA",
                  color: "white",
                  fontWeight: "600",
                  padding: "0.9rem 1.2rem",
                  borderRadius: "10px",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  fontSize: "0.95rem",
                  letterSpacing: "0.3px",
                  transition: "all 0.3s ease",
                  fontFamily: "'Open Sans', sans-serif",
                  boxSizing: "border-box",
                  boxShadow: "0 4px 16px rgba(141, 136, 234, 0.25)",
                }}
                onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = "#6E6AB8", e.target.style.boxShadow = "0 6px 20px rgba(110, 106, 184, 0.4)", e.target.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = "#8D88EA", e.target.style.boxShadow = "0 4px 16px rgba(141, 136, 234, 0.25)", e.target.style.transform = "translateY(0)")}
              >
                {isSubmitting ? "🔄 Signing in..." : "Sign In"}
              </button>

              {/* Footer Link */}
              <p style={{
                textAlign: "center",
                color: "#6B7280",
                fontSize: "0.9rem",
                fontWeight: "400",
              }}>
                Not a member?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  style={{
                    color: "#8D88EA",
                    fontWeight: "700",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                    padding: "0",
                    letterSpacing: "0.2px",
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
      </div>
    </>
  );
};

export default Login;
