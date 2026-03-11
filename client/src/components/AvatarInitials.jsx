import React from "react";

const AvatarInitials = ({ firstName = "", lastName = "", size = 80 }) => {
  // Generate initials
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Generate a consistent color based on initials (deterministic)
  const colors = [
    "#8D88EA",
    "#FF6B6B",
    "#4ECDC4",
    "#FFE66D",
    "#95E1D3",
    "#F38181",
    "#AA96DA",
    "#FCBAD3",
  ];
  
  const colorIndex = initials.charCodeAt(0) % colors.length;
  const backgroundColor = colors[colorIndex];

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: `${size * 0.4}px`,
        fontWeight: "bold",
        color: "#FFFFFF",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        flexShrink: 0,
      }}
      title={`${firstName} ${lastName}`}
    >
      {initials}
    </div>
  );
};

export default AvatarInitials;
