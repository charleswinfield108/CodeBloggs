import React from "react";

const SearchFilters = ({ firstName, lastName, onFirstNameChange, onLastNameChange, onClear }) => {
  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "flex-end" }}>
      {/* First Name Input */}
      <div style={{ flex: 1 }}>
        <label htmlFor="firstName" style={{ display: "block", color: "#1F2340", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem" }}>
          First Name
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Search by first name..."
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #E0E0E0",
            borderRadius: "6px",
            fontSize: "0.9rem",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#8D88EA")}
          onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
        />
      </div>

      {/* Last Name Input */}
      <div style={{ flex: 1 }}>
        <label htmlFor="lastName" style={{ display: "block", color: "#1F2340", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem" }}>
          Last Name
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Search by last name..."
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #E0E0E0",
            borderRadius: "6px",
            fontSize: "0.9rem",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#8D88EA")}
          onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
        />
      </div>

      {/* Clear Button */}
      <button
        onClick={onClear}
        style={{
          backgroundColor: "#F5F5F5",
          color: "#1F2340",
          border: "1px solid #E0E0E0",
          borderRadius: "6px",
          padding: "0.75rem 1.5rem",
          fontSize: "0.9rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#E8E8E8";
          e.currentTarget.style.borderColor = "#8D88EA";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#F5F5F5";
          e.currentTarget.style.borderColor = "#E0E0E0";
        }}
      >
        Clear
      </button>
    </div>
  );
};

export default SearchFilters;
