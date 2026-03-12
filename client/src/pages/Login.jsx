import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import logo from "../assets/CodeBloggs_ logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useSession();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/session/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
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
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Open Sans', sans-serif",
    }}>
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #F6F7FF, white)",
        padding: "0",
      }}>
        <div style={{ width: "100%", maxWidth: "28rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <img
              src={logo}
              alt="CodeBloggs Logo"
              style={{
                height: "48px",
                marginBottom: "0.5rem",
                objectFit: "contain",
              }}
            />
            <h1 style={{
              fontSize: "24px",
              fontWeight: "400",
              color: "#8D88EA",
              marginBottom: "0.5rem",
              fontFamily: "'Open Sans', sans-serif",
            }}>
              Welcome to CodeBloggs, Please Login
            </h1>
          </div>

          <div style={{
            background: "linear-gradient(to bottom, #8D88EA 0%, #A49EF0 100%)",
            borderRadius: "0.75rem",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)",
            padding: "1.2rem",
            border: "1px solid #8D88EA",
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "0.8rem" }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "white",
                    marginBottom: "0.4rem",
                    fontFamily: "'Open Sans', sans-serif",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.8rem",
                    border: "1px solid #8D88EA",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    outline: "none",
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: "400",
                    boxSizing: "border-box",
                    color: "#1F2340",
                  }}
                  disabled={loading}
                />
              </div>

              <div style={{ marginBottom: "0.8rem" }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "white",
                    marginBottom: "0.4rem",
                    fontFamily: "'Open Sans', sans-serif",
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
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.8rem",
                      paddingRight: "2.5rem",
                      border: "1px solid #8D88EA",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      outline: "none",
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: "400",
                      boxSizing: "border-box",
                      color: "#1F2340",
                    }}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.8rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: "1.2rem",
                      color: "#8D88EA",
                      padding: "0.4rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    disabled={loading}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  marginBottom: "0.8rem",
                  padding: "0.6rem",
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "0.5rem",
                }}>
                  <p style={{
                    color: "#DC2626",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontFamily: "'Open Sans', sans-serif",
                  }}>
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: loading ? "#D1D5DB" : "white",
                  color: loading ? "#9CA3AF" : "#8D88EA",
                  fontWeight: "600",
                  padding: "0.5rem 0.8rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  transition: "background-color 0.2s",
                  fontFamily: "'Open Sans', sans-serif",
                  boxSizing: "border-box",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#6C63D9", e.target.style.color = "white")}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "white", e.target.style.color = "#8D88EA")}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div style={{
              margin: "0.8rem 0",
              display: "flex",
              alignItems: "center",
            }}>
              <div style={{
                flex: 1,
                borderTop: "1px solid white",
              }}></div>
              <span style={{
                padding: "0 0.5rem",
                color: "white",
                fontSize: "0.875rem",
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: "400",
              }}>or</span>
              <div style={{
                flex: 1,
                borderTop: "1px solid white",
              }}></div>
            </div>

            <p style={{
              textAlign: "center",
              color: "white",
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: "400",
              fontSize: "1.125rem",
            }}>
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                style={{
                  color: "white",
                  fontWeight: "700",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: "1.125rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#6C63D9")}
                onMouseLeave={(e) => (e.target.style.color = "white")}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      <footer style={{
        height: "80px",
        backgroundColor: "#8D88EA",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Open Sans', sans-serif",
        fontSize: "1rem",
      }}>
        <p style={{
          margin: 0,
          color: "white",
        }}>
          © 2026 CodeBloggs. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Login;
