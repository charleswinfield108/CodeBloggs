import React from "react";
import { useToast } from "../context/ToastContext";
import { FiCheck, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";

const Toast = () => {
  const { toasts, removeToast } = useToast();

  const getIconAndColor = (type) => {
    switch (type) {
      case "success":
        return { icon: FiCheck, color: "#27AE60", bgColor: "#D5F4E6" };
      case "error":
        return { icon: FiX, color: "#E74C3C", bgColor: "#FADBD8" };
      case "warning":
        return { icon: FiAlertCircle, color: "#F39C12", bgColor: "#FCF3CF" };
      case "info":
        return { icon: FiInfo, color: "#3498DB", bgColor: "#D6EAF8" };
      default:
        return { icon: FiInfo, color: "#3498DB", bgColor: "#D6EAF8" };
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 3000,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => {
        const { icon: Icon, color, bgColor } = getIconAndColor(toast.type);

        return (
          <div
            key={toast.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem 1.5rem",
              backgroundColor: bgColor,
              borderLeft: `4px solid ${color}`,
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              minWidth: "300px",
              maxWidth: "400px",
              animation: "slideIn 0.3s ease-out",
              pointerEvents: "auto",
            }}
          >
            <Icon
              size={20}
              style={{
                color: color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: "#1F2340",
                fontSize: "0.95rem",
                fontWeight: "500",
                flex: 1,
              }}
            >
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                color: color,
                cursor: "pointer",
                padding: "0.25rem",
                flexShrink: 0,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <FiX size={18} />
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
