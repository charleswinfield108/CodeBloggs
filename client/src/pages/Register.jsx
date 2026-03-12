import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/CodeBloggs_ logo.png";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    password: "",
    occupation: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (successMessage) setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    } else if (formData.first_name.length > 50) {
      newErrors.first_name = "First name must be less than 50 characters";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    } else if (formData.last_name.length > 50) {
      newErrors.last_name = "Last name must be less than 50 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.birthdate) {
      newErrors.birthdate = "Birthdate is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = "Occupation is required";
    } else if (formData.occupation.length > 50) {
      newErrors.occupation = "Occupation must be less than 50 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (formData.location.length > 50) {
      newErrors.location = "Location must be less than 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5050/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "Registration failed" });
        setLoading(false);
        return;
      }

      setSuccessMessage("Registration successful! Redirecting to login...");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        birthdate: "",
        password: "",
        occupation: "",
        location: "",
      });
      setErrors({});

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ general: "An error occurred. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #F6F7FF, white)",
          padding: "0",
        }}
      >
        <div style={{ width: "100%", maxWidth: "63%", paddingTop: "1rem", paddingBottom: "1rem" }}>
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
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "400",
                color: "#8D88EA",
                marginBottom: "0.5rem",
                fontFamily: "'Open Sans', sans-serif",
              }}
            >
              Create Your CodeBloggs Account
            </h1>
          </div>

          <div
            style={{
              background: "linear-gradient(to bottom, #8D88EA 0%, #A49EF0 100%)",
              borderRadius: "0.75rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)",
              padding: "1.2rem",
              border: "1px solid #8D88EA",
            }}
          >
            <form onSubmit={handleSubmit}>
              {errors.general && (
                <div
                  style={{
                    marginBottom: "0.8rem",
                    padding: "0.6rem",
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: "0.5rem",
                  }}
                >
                  <p
                    style={{
                      color: "#DC2626",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      fontFamily: "'Open Sans', sans-serif",
                      margin: "0",
                    }}
                  >
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Two Column Row: First Name & Last Name */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "0.8rem" }}>
                {/* First Name */}
                <div>
                  <label
                    htmlFor="first_name"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "white",
                      marginBottom: "0.4rem",
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.8rem",
                      border: errors.first_name ? "1px solid #DC2626" : "1px solid #8D88EA",
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
                  {errors.first_name && (
                    <p
                      style={{
                        color: "#FCA5A5",
                        fontSize: "0.75rem",
                        marginTop: "0.2rem",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    >
                      {errors.first_name}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="last_name"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "white",
                      marginBottom: "0.4rem",
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.8rem",
                      border: errors.last_name ? "1px solid #DC2626" : "1px solid #8D88EA",
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
                  {errors.last_name && (
                    <p
                      style={{
                        color: "#FCA5A5",
                        fontSize: "0.75rem",
                        marginTop: "0.2rem",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    >
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Email and Birthdate Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "0.8rem" }}>
                {/* Email */}
                <div>
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
                      border: errors.email ? "1px solid #DC2626" : "1px solid #8D88EA",
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
                  {errors.email && (
                    <p
                      style={{
                        color: "#FCA5A5",
                        fontSize: "0.75rem",
                        marginTop: "0.2rem",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Birthdate */}
                <div>
                  <label
                    htmlFor="birthdate"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "white",
                      marginBottom: "0.4rem",
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  >
                    Birthdate
                  </label>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.8rem",
                      border: errors.birthdate ? "1px solid #DC2626" : "1px solid #8D88EA",
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
                  {errors.birthdate && (
                    <p
                      style={{
                        color: "#FCA5A5",
                        fontSize: "0.75rem",
                        marginTop: "0.2rem",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    >
                      {errors.birthdate}
                    </p>
                  )}
                </div>
              </div>

              {/* Two Column Row: Password & Occupation */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "0.8rem" }}>
                {/* Password */}
                <div>
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
                        padding: "0.5rem 0.8rem 0.5rem 0.8rem",
                        paddingRight: "2.5rem",
                        border: errors.password ? "1px solid #DC2626" : "1px solid #8D88EA",
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
                  {errors.password && (
                    <p
                      style={{
                        color: "#FCA5A5",
                        fontSize: "0.75rem",
                        marginTop: "0.2rem",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Occupation */}
                <div>
                  <label
                    htmlFor="occupation"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "white",
                      marginBottom: "0.4rem",
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  >
                    Occupation
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Software Developer"
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.8rem",
                      border: errors.occupation ? "1px solid #DC2626" : "1px solid #8D88EA",
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
                  {errors.occupation && (
                    <p
                      style={{
                        color: "#FCA5A5",
                        fontSize: "0.75rem",
                        marginTop: "0.2rem",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    >
                      {errors.occupation}
                    </p>
                  )}
                </div>
              </div>

              {/* Location - Full Width */}
              <div style={{ marginBottom: "0.8rem" }}>
                <label
                  htmlFor="location"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "white",
                    marginBottom: "0.4rem",
                    fontFamily: "'Open Sans', sans-serif",
                  }}
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="San Francisco, CA"
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.8rem",
                    border: errors.location ? "1px solid #DC2626" : "1px solid #8D88EA",
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
                {errors.location && (
                  <p
                    style={{
                      color: "#FCA5A5",
                      fontSize: "0.75rem",
                      marginTop: "0.2rem",
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  >
                    {errors.location}
                  </p>
                )}
              </div>

              {successMessage && (
                <div
                  style={{
                    marginBottom: "0.8rem",
                    padding: "0.6rem",
                    backgroundColor: "#DCFCE7",
                    border: "1px solid #86EFAC",
                    borderRadius: "0.5rem",
                  }}
                >
                  <p
                    style={{
                      color: "#16A34A",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      fontFamily: "'Open Sans', sans-serif",
                      margin: "0",
                    }}
                  >
                    {successMessage}
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
                  marginTop: "0.4rem",
                }}
                onMouseEnter={(e) =>
                  !loading && (e.target.style.backgroundColor = "#6C63D9", (e.target.style.color = "white"))
                }
                onMouseLeave={(e) =>
                  !loading && (e.target.style.backgroundColor = "white", (e.target.style.color = "#8D88EA"))
                }
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p
              style={{
                textAlign: "center",
                color: "white",
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: "400",
                fontSize: "1.125rem",
                marginTop: "1rem",
              }}
            >
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
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
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer
        style={{
          height: "80px",
          backgroundColor: "#8D88EA",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: "300",
          fontSize: "0.875rem",
        }}
      >
        © 2026 CodeBloggs. All rights reserved.
      </footer>
    </div>
  );
};

export default Register;
