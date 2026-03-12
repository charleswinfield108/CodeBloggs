/**
 * Get avatar background color based on initials
 * Uses deterministic color mapping so same initials always get same color
 */
export const getAvatarColor = (firstName = "", lastName = "") => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  
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
  return colors[colorIndex];
};
