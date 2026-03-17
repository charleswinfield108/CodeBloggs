import React from "react";

const SkeletonLoader = ({ type = "post", count = 10 }) => {
  const skeletonStyle = {
    backgroundColor: "#D3D3D3",
    borderRadius: "6px",
    animation: "pulse 2s ease-in-out infinite",
  };

  const postSkeleton = (
    <div key={`skeleton-post`} style={{
      backgroundColor: "#FFFFFF",
      border: "1px solid #E0E0E0",
      borderRadius: "12px",
      padding: "1.5rem",
      marginBottom: "1rem",
      display: "flex",
      flexDirection: "row",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    }}>
      {/* Left Side - Author Info Skeleton */}
      <div style={{ width: "20%", paddingRight: "1.5rem", borderRight: "1px solid #E0E0E0", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
        {/* Avatar skeleton */}
        <div style={{
          ...skeletonStyle,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
        }}></div>
        {/* Name skeleton */}
        <div style={{
          ...skeletonStyle,
          width: "100%",
          height: "12px",
        }}></div>
        {/* Date skeleton */}
        <div style={{
          ...skeletonStyle,
          width: "80%",
          height: "10px",
        }}></div>
        {/* Status skeleton */}
        <div style={{
          ...skeletonStyle,
          width: "70%",
          height: "10px",
        }}></div>
      </div>

      {/* Right Side - Content Skeleton */}
      <div style={{ width: "80%", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* Content skeleton - 3 lines */}
        {[0, 1, 2].map((i) => (
          <div key={`line-${i}`} style={{
            ...skeletonStyle,
            width: i === 2 ? "60%" : "100%",
            height: "12px",
          }}></div>
        ))}
        {/* Buttons skeleton */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <div style={{
            ...skeletonStyle,
            width: "80px",
            height: "28px",
            borderRadius: "8px",
          }}></div>
          <div style={{
            ...skeletonStyle,
            width: "80px",
            height: "28px",
            borderRadius: "8px",
          }}></div>
        </div>
      </div>
    </div>
  );

  const cardSkeleton = (
    <div key={`skeleton-card`} style={{
      backgroundColor: "#FFFFFF",
      border: "1px solid #8D88EA",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      height: "fit-content",
    }}>
      {/* Avatar skeleton */}
      <div style={{
        ...skeletonStyle,
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        alignSelf: "center",
      }}></div>
      {/* Name skeleton */}
      <div style={{
        ...skeletonStyle,
        width: "100%",
        height: "14px",
      }}></div>
      {/* Role skeleton */}
      <div style={{
        ...skeletonStyle,
        width: "80%",
        height: "12px",
        alignSelf: "center",
      }}></div>
      {/* Bio skeleton - 2 lines */}
      {[0, 1].map((i) => (
        <div key={`bio-${i}`} style={{
          ...skeletonStyle,
          width: i === 1 ? "70%" : "100%",
          height: "10px",
        }}></div>
      ))}
      {/* Button skeleton */}
      <div style={{
        ...skeletonStyle,
        width: "100%",
        height: "32px",
        borderRadius: "8px",
        marginTop: "0.5rem",
      }}></div>
    </div>
  );

  const userSkeleton = (
    <tr key={`skeleton-user`} style={{
      backgroundColor: "#F9F9FB",
      borderBottom: "1px solid #E0E0E0",
    }}>
      <td style={{ padding: "0.75rem", color: "#1F2340", fontSize: "0.75rem" }}>
        <div style={{
          ...skeletonStyle,
          width: "100px",
          height: "12px",
        }}></div>
      </td>
      <td style={{ padding: "0.75rem", color: "#1F2340", fontSize: "0.75rem" }}>
        <div style={{
          ...skeletonStyle,
          width: "100px",
          height: "12px",
        }}></div>
      </td>
      <td style={{ padding: "0.75rem", color: "#1F2340", fontSize: "0.75rem" }}>
        <div style={{
          ...skeletonStyle,
          width: "80px",
          height: "12px",
        }}></div>
      </td>
      <td style={{ padding: "0.75rem", color: "#1F2340", fontSize: "0.75rem" }}>
        <div style={{
          ...skeletonStyle,
          width: "60px",
          height: "12px",
        }}></div>
      </td>
      <td style={{ padding: "0.75rem", textAlign: "center" }}>
        <div style={{
          ...skeletonStyle,
          width: "40px",
          height: "12px",
          margin: "0 auto",
        }}></div>
      </td>
      <td style={{ padding: "0.75rem", textAlign: "center" }}>
        <div style={{
          display: "flex",
          gap: "0.5rem",
          justifyContent: "center",
        }}>
          <div style={{
            ...skeletonStyle,
            width: "30px",
            height: "24px",
            borderRadius: "4px",
          }}></div>
          <div style={{
            ...skeletonStyle,
            width: "30px",
            height: "24px",
            borderRadius: "4px",
          }}></div>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
      {type === "user" ? (
        // Table rows for user type
        Array.from({ length: count }).map((_, index) => (
          <tr key={`skeleton-${index}`} style={{
            backgroundColor: "#F9F9FB",
            borderBottom: "1px solid #E0E0E0",
          }}>
            <td style={{ padding: "0.75rem", color: "#1F2340", fontSize: "0.75rem" }}>
              <div style={{
                ...skeletonStyle,
                width: "100px",
                height: "12px",
              }}></div>
            </td>
            <td style={{ padding: "0.75rem", color: "#1F2340", fontSize: "0.75rem" }}>
              <div style={{
                ...skeletonStyle,
                width: "100px",
                height: "12px",
              }}></div>
            </td>
            <td style={{ padding: "0.75rem", color: "#1F2340", fontSize: "0.75rem" }}>
              <div style={{
                ...skeletonStyle,
                width: "80px",
                height: "12px",
              }}></div>
            </td>
            <td style={{ padding: "0.75rem", color: "#1F2340", fontSize: "0.75rem" }}>
              <div style={{
                ...skeletonStyle,
                width: "60px",
                height: "12px",
              }}></div>
            </td>
            <td style={{ padding: "0.75rem", textAlign: "center" }}>
              <div style={{
                ...skeletonStyle,
                width: "40px",
                height: "12px",
                margin: "0 auto",
              }}></div>
            </td>
            <td style={{ padding: "0.75rem", textAlign: "center" }}>
              <div style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
              }}>
                <div style={{
                  ...skeletonStyle,
                  width: "30px",
                  height: "24px",
                  borderRadius: "4px",
                }}></div>
                <div style={{
                  ...skeletonStyle,
                  width: "30px",
                  height: "24px",
                  borderRadius: "4px",
                }}></div>
              </div>
            </td>
          </tr>
        ))
      ) : (
        // Div-based skeletons for post and card types
        <div style={{
          display: type === "card" ? "grid" : "flex",
          gridTemplateColumns: type === "card" ? "repeat(auto-fill, minmax(300px, 1fr))" : undefined,
          flexDirection: type === "card" ? undefined : "column",
          gap: "1.5rem",
        }}>
          {Array.from({ length: count }).map((_, index) => (
            <div key={`skeleton-${index}`}>
              {type === "post" && postSkeleton}
              {type === "card" && cardSkeleton}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SkeletonLoader;
