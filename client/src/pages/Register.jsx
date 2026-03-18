import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializeAutocomplete, getSelectedPlace, clearAutocomplete } from "../utils/placesAutoComplete";
import logo from "../assets/CodeBloggs_ logo.png";

const Register = () => {
  const navigate = useNavigate();
  // State for responsive design
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
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

  /**
   * Clear autofilled credentials on component mount
   * This prevents the browser from auto-populating saved credentials
   */
  useEffect(() => {
    // Clear input fields to prevent autofill
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    
    if (emailInput) emailInput.value = "";
    if (passwordInput) passwordInput.value = "";
    
    // Update React state
    setFormData((prev) => ({
      ...prev,
      email: "",
      password: "",
    }));
    
    // Re-clear after a short delay (browser may refill after React renders)
    const timer = setTimeout(() => {
      if (emailInput) emailInput.value = "";
      if (passwordInput) passwordInput.value = "";
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize Google Places Autocomplete when location input mounts
  useEffect(() => {
    const locationInput = document.getElementById("location");
    if (locationInput) {
      // Initialize the autocomplete
      initializeAutocomplete(locationInput);
      
      // Listen for place selection
      const handlePlaceChanged = () => {
        const place = getSelectedPlace();
        if (place) {
          setFormData((prev) => ({
            ...prev,
            location: place.name,
          }));
          // Clear any location validation errors
          if (errors.location) {
            setErrors((prev) => ({
              ...prev,
              location: "",
            }));
          }
          console.log('📍 Location updated:', place.name);
        }
      };
      
      locationInput.addEventListener('placeChanged', handlePlaceChanged);
      locationInput.addEventListener('change', handlePlaceChanged);
      
      return () => {
        locationInput.removeEventListener('placeChanged', handlePlaceChanged);
        locationInput.removeEventListener('change', handlePlaceChanged);
        clearAutocomplete();
      };
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For non-location fields, update normally
    if (name !== "location") {
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
    } else {
      // For location field, just update the form data
      // The autocomplete dropdown is handled by Google's API
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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
        body: JSON.stringify({
          ...formData,
          auth_level: "basic",
        }),
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
    <>
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
          marginBottom: isDesktop ? "0.75rem" : "0.5rem",
          position: "relative",
          top: isDesktop ? "-20px" : "-5px",
        }}>
          <img
            src={logo}
            alt="CodeBloggs Logo"
            style={{
              height: isDesktop ? "40px" : "30px",
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
          {/* Sign Up Form Card - Styled like User Manager Card */}
          <div style={{
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #8D88EA",
            borderRadius: "12px",
            padding: "calc(0.8rem + 15px)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            transition: "all 0.3s ease",
            maxHeight: "85vh",
            overflowY: "auto",
          }}>
            {/* Welcome Section Inside Card */}
            <div style={{
              textAlign: "center",
              marginBottom: "0.5rem",
            }}>
              <h1 style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "0.2rem",
                color: "#8D88EA",
                lineHeight: "1.2",
                margin: "0 0 0.15rem 0",
              }}>
                Create Account
              </h1>
              <p style={{
                fontSize: "0.8rem",
                fontWeight: "400",
                color: "#666",
                marginBottom: 0,
                lineHeight: "1.4",
              }}>
                Join our community and start sharing
              </p>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off">
              {/* Hidden inputs to confuse browser autofill */}
              <input type="email" style={{ display: "none" }} />
              <input type="password" style={{ display: "none" }} />
              
              {errors.general && (
                <div
                  style={{
                    marginBottom: "0.5rem",
                    padding: "0.6rem 0.8rem",
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FCA5A5",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>⚠️</span>
                  <p
                    style={{
                      color: "#B91C1C",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      fontFamily: "'Open Sans', sans-serif",
                      margin: "0",
                      flex: 1,
                    }}
                  >
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Row 1: First Name, Last Name, Birthdate */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem", marginBottom: "0.5rem" }}>
                {/* First Name */}
                <div>
                  <label
                    htmlFor="first_name"
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      color: "#1F2340",
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
                    maxLength="50"
                    placeholder="John"
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      border: errors.first_name ? "1px solid #FCA5A5" : "1px solid #E3E6F5",
                      borderRadius: "8px",
                      fontSize: "12px",
                      outline: "none",
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: "400",
                      boxSizing: "border-box",
                      color: "#1F2340",
                      backgroundColor: errors.first_name ? "#FEF2F2" : "#F6F7FF",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8D88EA";
                      e.target.style.backgroundColor = "#FFFFFF";
                      e.target.style.boxShadow = "0 0 0 3px rgba(141, 136, 234, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.first_name ? "#FCA5A5" : "#E3E6F5";
                      e.target.style.backgroundColor = errors.first_name ? "#FEF2F2" : "#F6F7FF";
                      e.target.style.boxShadow = "none";
                    }}
                    disabled={loading}
                  />
                  {errors.first_name && (
                    <p
                      style={{
                        color: "#B91C1C",
                        fontSize: "0.75rem",
                        marginTop: "0.3rem",
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
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#1F2340",
                      marginBottom: "0.6rem",
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
                    maxLength="50"
                    placeholder="Doe"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: errors.last_name ? "1px solid #FCA5A5" : "1px solid #E3E6F5",
                      borderRadius: "8px",
                      fontSize: "12px",
                      outline: "none",
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: "400",
                      boxSizing: "border-box",
                      color: "#1F2340",
                      backgroundColor: errors.last_name ? "#FEF2F2" : "#F6F7FF",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8D88EA";
                      e.target.style.backgroundColor = "#FFFFFF";
                      e.target.style.boxShadow = "0 0 0 3px rgba(141, 136, 234, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.last_name ? "#FCA5A5" : "#E3E6F5";
                      e.target.style.backgroundColor = errors.last_name ? "#FEF2F2" : "#F6F7FF";
                      e.target.style.boxShadow = "none";
                    }}
                    disabled={loading}
                  />
                  {errors.last_name && (
                    <p
                      style={{
                        color: "#B91C1C",
                        fontSize: "0.75rem",
                        marginTop: "0.3rem",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    >
                      {errors.last_name}
                    </p>
                  )}
                </div>

                {/* Birthdate */}
                <div>
                  <label
                    htmlFor="birthdate"
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#1F2340",
                      marginBottom: "0.6rem",
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
                      padding: "0.75rem 1rem",
                      border: errors.birthdate ? "1px solid #FCA5A5" : "1px solid #E3E6F5",
                      borderRadius: "8px",
                      fontSize: "12px",
                      outline: "none",
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: "400",
                      boxSizing: "border-box",
                      color: "#1F2340",
                      backgroundColor: errors.birthdate ? "#FEF2F2" : "#F6F7FF",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8D88EA";
                      e.target.style.backgroundColor = "#FFFFFF";
                      e.target.style.boxShadow = "0 0 0 3px rgba(141, 136, 234, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.birthdate ? "#FCA5A5" : "#E3E6F5";
                      e.target.style.backgroundColor = errors.birthdate ? "#FEF2F2" : "#F6F7FF";
                      e.target.style.boxShadow = "none";
                    }}
                    disabled={loading}
                  />
                  {errors.birthdate && (
                    <p
                      style={{
                        color: "#B91C1C",
                        fontSize: "0.75rem",
                        marginTop: "0.3rem",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    >
                      {errors.birthdate}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Email, Password, Occupation */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem", marginBottom: "0.7rem" }}>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#1F2340",
                      marginBottom: "0.6rem",
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="off"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: errors.email ? "1px solid #FCA5A5" : "1px solid #E3E6F5",
                      borderRadius: "8px",
                      fontSize: "12px",
                      outline: "none",
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: "400",
                      boxSizing: "border-box",
                      color: "#1F2340",
                      backgroundColor: errors.email ? "#FEF2F2" : "#F6F7FF",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8D88EA";
                      e.target.style.backgroundColor = "#FFFFFF";
                      e.target.style.boxShadow = "0 0 0 3px rgba(141, 136, 234, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.email ? "#FCA5A5" : "#E3E6F5";
                      e.target.style.backgroundColor = errors.email ? "#FEF2F2" : "#F6F7FF";
                      e.target.style.boxShadow = "none";
                    }}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p
                      style={{
                        color: "#B91C1C",
                        fontSize: "0.75rem",
                        marginTop: "0.3rem",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#1F2340",
                      marginBottom: "0.6rem",
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
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        paddingRight: "2.8rem",
                        border: errors.password ? "1px solid #FCA5A5" : "1px solid #E3E6F5",
                        borderRadius: "8px",
                        fontSize: "12px",
                        outline: "none",
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: "400",
                        boxSizing: "border-box",
                        color: "#1F2340",
                        backgroundColor: errors.password ? "#FEF2F2" : "#F6F7FF",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#8D88EA";
                        e.target.style.backgroundColor = "#FFFFFF";
                        e.target.style.boxShadow = "0 0 0 3px rgba(141, 136, 234, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.password ? "#FCA5A5" : "#E3E6F5";
                        e.target.style.backgroundColor = errors.password ? "#FEF2F2" : "#F6F7FF";
                        e.target.style.boxShadow = "none";
                      }}
                      disabled={loading}
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
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "1.1rem",
                        color: "#8D88EA",
                        padding: "0.4rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: loading ? "0.5" : "1",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => !loading && (e.target.style.color = "#6E6AB8")}
                      onMouseLeave={(e) => !loading && (e.target.style.color = "#8D88EA")}
                      disabled={loading}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      style={{
                        color: "#B91C1C",
                        fontSize: "0.75rem",
                        marginTop: "0.3rem",
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
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#1F2340",
                      marginBottom: "0.6rem",
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
                    maxLength="50"
                    placeholder="Software Developer"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: errors.occupation ? "1px solid #FCA5A5" : "1px solid #E3E6F5",
                      borderRadius: "8px",
                      fontSize: "12px",
                      outline: "none",
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: "400",
                      boxSizing: "border-box",
                      color: "#1F2340",
                      backgroundColor: errors.occupation ? "#FEF2F2" : "#F6F7FF",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8D88EA";
                      e.target.style.backgroundColor = "#FFFFFF";
                      e.target.style.boxShadow = "0 0 0 3px rgba(141, 136, 234, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.occupation ? "#FCA5A5" : "#E3E6F5";
                      e.target.style.backgroundColor = errors.occupation ? "#FEF2F2" : "#F6F7FF";
                      e.target.style.boxShadow = "none";
                    }}
                    disabled={loading}
                  />
                  {errors.occupation && (
                    <p
                      style={{
                        color: "#B91C1C",
                        fontSize: "0.75rem",
                        marginTop: "0.3rem",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    >
                      {errors.occupation}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Location - Full Width */}
              <div style={{ marginBottom: "0.7rem", position: "relative" }}>
                <label
                  htmlFor="location"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#1F2340",
                    marginBottom: "0.6rem",
                    fontFamily: "'Open Sans', sans-serif",
                  }}
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  maxLength="50"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: errors.location ? "1px solid #FCA5A5" : "1px solid #E3E6F5",
                    borderRadius: "8px",
                    fontSize: "12px",
                    outline: "none",
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: "400",
                    boxSizing: "border-box",
                    color: "#1F2340",
                    backgroundColor: errors.location ? "#FEF2F2" : "#F6F7FF",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8D88EA";
                    e.target.style.backgroundColor = "#FFFFFF";
                    e.target.style.boxShadow = "0 0 0 3px rgba(141, 136, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.location ? "#FCA5A5" : "#E3E6F5";
                    e.target.style.backgroundColor = errors.location ? "#FEF2F2" : "#F6F7FF";
                    e.target.style.boxShadow = "none";
                  }}
                  disabled={loading}
                />
                
                {errors.location && (
                  <p
                    style={{
                      color: "#B91C1C",
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
                    marginBottom: "0.7rem",
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
                  backgroundColor: loading ? "#D1D5DB" : "#8D88EA",
                  color: "white",
                  fontWeight: "600",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  fontFamily: "'Open Sans', sans-serif",
                  boxSizing: "border-box",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  marginTop: "1rem",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#6E6AB8";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(141, 136, 234, 0.3)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#8D88EA";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p
              style={{
                textAlign: "center",
                color: "#1F2340",
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: "400",
                fontSize: "0.95rem",
                marginTop: "1rem",
              }}
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                style={{
                  color: "#8D88EA",
                  fontWeight: "700",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: "0.95rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#6E6AB8")}
                onMouseLeave={(e) => (e.target.style.color = "#8D88EA")}
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
