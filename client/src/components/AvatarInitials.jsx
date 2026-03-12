import React from "react";
import { getAvatarColor } from "../utils/avatarColors";

const AvatarInitials = ({ firstName = "", lastName = "", size = 80 }) => {
  // Generate initials
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Get consistent color based on initials
  const backgroundColor = getAvatarColor(firstName, lastName);

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
