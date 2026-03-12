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
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {toasts.map((toast) => {
        const { icon: IconComponent, color, bgColor } = getIconAndColor(toast.type);

        return (
          <div
            key={toast.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
              backgroundColor: bgColor,
              color: color,
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              animation: "slideIn 0.3s ease",
            }}
          >
            <IconComponent size={20} />
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: color,
                fontSize: "1.25rem",
                padding: 0,
                marginLeft: "0.5rem",
              }}
            >
              ×
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
