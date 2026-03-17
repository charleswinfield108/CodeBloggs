import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import PostModal from "./PostModal";
import Toast from "./Toast";

/**
 * Layout Component - Responsive Container
 * 
 * MDN Responsive Design Approach:
 * - Mobile-first: Mobile navigation at < 768px
 * - Tablet/Desktop: Desktop sidebar at ≥ 768px
 * - Flexible layout using flexbox
 * - Adapts to window resize events
 * 
 * Breakpoints:
 * - Mobile: < 768px (uses MobileNavigation)
 * - Desktop: ≥ 768px (uses Sidebar)
 */
const Layout = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerHeight = "95px";
  const mobileNavHeight = "64px";
  const totalMobileHeaderHeight = "159px"; // 95px header + 64px mobile nav

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      {!isDesktop && <MobileNavigation />}
      <PostModal />
      <Toast />
      <div
        style={{
          display: "flex",
          flex: 1,
          marginTop: isDesktop ? headerHeight : totalMobileHeaderHeight,
        }}
      >
        {isDesktop && <Sidebar />}
        <main
          style={{
            marginLeft: isDesktop ? "250px" : "0",
            padding: isDesktop ? "0.5rem 2rem 0.5rem 2rem" : "1rem",
            backgroundColor: "#FFFFFF",
            flex: 1,
            overflowY: "auto",
            boxSizing: "border-box",
            // Responsive height calculation
            height: isDesktop
              ? `calc(100vh - ${headerHeight})`
              : `calc(100vh - ${totalMobileHeaderHeight})`,
            // Mobile adjustments
            ...(window.innerWidth < 480 && {
              padding: "0.75rem",
            }),
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
