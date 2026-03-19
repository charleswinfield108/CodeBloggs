# CodeBloggs Authentication Guide

## Overview

CodeBloggs uses a **session-token-based authentication system** where the frontend receives a unique UUID token upon login and uses that token to validate all subsequent requests. The token is stored in a browser cookie and validated against the database on each protected route access.

---

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [Token Storage & Management](#token-storage--management)
3. [Making Authenticated Requests](#making-authenticated-requests)
4. [Protected Routes](#protected-routes)
5. [Session Validation](#session-validation)
6. [Token Expiration & Refresh](#token-expiration--refresh)
7. [Logout & Cleanup](#logout--cleanup)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)

---

## Authentication Flow

### Step 1: User Registration

**Endpoint:** `POST /user/register`

```javascript
// Frontend code
const registerUser = async (userData) => {
  const response = await fetch("http://localhost:5050/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: "user@example.com",
      password: "securePassword123",
      first_name: "John",
      last_name: "Doe",
      username: "johndoe",
      occupation: "Software Engineer",
      location: "San Francisco, CA"
    })
  });

  const data = await response.json();
  if (response.ok) {
    console.log("User registered successfully");
    return data;
  } else {
    console.error("Registration failed:", data.error);
  }
};
```

**Backend Process:**
1. Validate required fields: email, password, first_name, last_name
2. Check if email already exists (prevent duplicates)
3. Hash password using bcrypt (SALT_ROUNDS = 10)
4. Create new user document in MongoDB
5. Return success message with user ID

---

### Step 2: User Login

**Endpoint:** `POST /session/login`

```javascript
// Frontend code
const loginUser = async (email, password) => {
  const response = await fetch("http://localhost:5050/session/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  const data = await response.json();
  
  if (response.ok) {
    // Extract token and session data from response
    const { session_token, id, first_name, last_name, auth_level, isOnline } = data;
    
    // Store token in cookie (handled by backend cookie settings)
    // Store session data in localStorage
    localStorage.setItem("session", JSON.stringify({
      id,
      first_name,
      last_name,
      auth_level,
      isOnline
    }));

    // Redirect to home
    window.location.href = "/home";
    return true;
  } else {
    console.error("Login failed:", data.error);
    return false;
  }
};
```

**Login Response:**
```json
{
  "session_token": "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
  "id": "507f1f77bcf86cd799439011",
  "first_name": "John",
  "last_name": "Doe",
  "auth_level": "basic",
  "isOnline": true
}
```

**Backend Process:**
1. Validate email and password fields exist
2. Query users collection for user with matching email
3. Use bcrypt.compare() to verify password against stored hash
4. Update user's `isOnline` and `lastSeen` fields
5. Generate UUID v4 session token
6. Create session document in MongoDB:
   ```javascript
   {
     session_token: "uuid-string",
     session_date: new Date(),
     user_id: ObjectId("user-id")
   }
   ```
7. Return session_token and user data to frontend

---

## Token Storage & Management

### Where Is the Token Stored?

#### 1. Browser Cookie: `session_token`
- **Created:** After successful login via Set-Cookie header
- **Expires:** 24 hours from login
- **HTTPOnly:** No (accessible via JavaScript for validation)
- **Secure:** Yes (only sent over HTTPS in production)
- **Path:** `/` (accessible across all application routes)
- **Domain:** `localhost` (in development)

#### 2. Browser LocalStorage: `session`
- **Stores:** User metadata (id, name, auth_level, etc.)
- **Format:** JSON string
- **Cleared:** On logout or token invalidation
- **Purpose:** Quick access to user info without API call

### Accessing the Token

```javascript
// Method 1: Direct cookie parsing
const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

const token = getCookie("session_token");
console.log(token); // "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6"

// Method 2: Via SessionContext (React)
import { useSession } from "../context/SessionContext";

const MyComponent = () => {
  const { session } = useSession();
  // Note: session contains user data, not token directly
  // Token is accessed via cookie in background
};
```

### Token Format

The session token is a **UUID v4** (Universally Unique Identifier version 4):
- Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Example: `a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6`
- Generated by: `const token = uuidv4();` (uuid npm package)
- Properties:
  - Cryptographically random
  - Unique across all sessions
  - Cannot be easily guessed or predicted
  - Not a JWT (no encoded payload)

---

## Making Authenticated Requests

### Token Passing Method: Query Parameter

All authenticated requests pass the session token as a **query parameter**:

```javascript
const token = getCookie("session_token");

// Example: GET /validate_token?token=TOKEN
const validateToken = async (token) => {
  const response = await fetch(
    `http://localhost:5050/validate_token?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
      credentials: "include"  // Include cookies
    }
  );
  return response.json();
};

// Example: GET /session/logout?token=TOKEN
const logoutUser = async (token) => {
  const response = await fetch(
    `http://localhost:5050/session/logout?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
      credentials: "include"
    }
  );
  return response.json();
};
```

### Why Query Parameter?

1. **Simplicity:** Easy to append to any URL
2. **State Preservation:** Survives page reloads within the request
3. **Cookie Redundancy:** Token also available in cookies for automatic inclusion
4. **Backward Compatibility:** Simple to parse on backend

### Important: Always Use `encodeURIComponent()`

```javascript
// ✅ CORRECT - Handles special characters
const token = "token-with-special-chars";
const url = `validate_token?token=${encodeURIComponent(token)}`;

// ❌ WRONG - May break with special characters
const url = `validate_token?token=${token}`;
```

---

## Protected Routes

### Frontend: ProtectedRoute Component

```javascript
// client/src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useSession();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = getCookie("session_token");
        
        if (!token) {
          setIsValid(false);
          setIsValidating(false);
          return;
        }

        // Validate with backend
        const response = await fetch(
          `http://localhost:5050/validate_token?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            credentials: "include"
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsValid(data.status === "ok" && data.data.valid);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, []);

  // Show loading state while validating
  if (isValidating || loading) {
    return <SkeletonLoader />;
  }

  // Redirect to login if not valid
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // Render protected component if valid
  return children;
};

export default ProtectedRoute;
```

### Usage in Routes

```javascript
// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes - no authentication needed */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes - require valid session */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <Blogs />
            </ProtectedRoute>
          }
        />
        
        {/* Admin-only routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
```

### Backend Route Protection

```javascript
// Not explicitly required for queries - validation happens on route level
// But you can add middleware for API endpoints

const requireAuth = (req, res, next) => {
  const token = req.query.token || req.body.token;
  
  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  // Validate token exists in database
  const session = await DB.collection("sessions").findOne({ 
    session_token: token 
  });

  if (!session) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.userId = session.user_id;
  next();
};

// Usage: app.get("/protected-endpoint", requireAuth, controllerFunction);
```

---

## Session Validation

### Initial Session Validation (App Launch)

When the app first loads, `SessionContext` validates the stored session:

```javascript
// client/src/context/SessionContext.jsx - initialization effect

useEffect(() => {
  const initializeSession = async () => {
    try {
      const tokenFromCookie = getCookie("session_token");
      
      if (tokenFromCookie) {
        // Validate token with backend
        const validateResponse = await fetch(
          `http://localhost:5050/validate_token?token=${encodeURIComponent(tokenFromCookie)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (validateResponse.ok) {
          const validateData = await validateResponse.json();
          
          if (validateData.status === "ok" && validateData.data.valid) {
            // Token valid - restore session from localStorage
            const storedSession = localStorage.getItem("session");
            if (storedSession) {
              const sessionData = JSON.parse(storedSession);
              setSession(sessionData);
            }
          } else {
            // Token invalid - clear all session data
            localStorage.removeItem("session");
            deleteCookie("session_token");
          }
        }
      }
    } catch (error) {
      console.error("Session initialization failed:", error);
    } finally {
      setLoading(false);
    }
  };

  initializeSession();
}, []);
```

### Periodic Token Validation (Every 5 Minutes)

```javascript
useEffect(() => {
  if (!session?.id) return; // Only run if logged in

  const validateTokenPeriodically = async () => {
    const tokenFromCookie = getCookie("session_token");
    
    if (!tokenFromCookie) {
      // Token missing - force logout
      setSession(null);
      localStorage.removeItem("session");
      deleteCookie("session_token");
      return;
    }

    const validateResponse = await fetch(
      `http://localhost:5050/validate_token?token=${encodeURIComponent(tokenFromCookie)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!validateResponse.ok) {
      // Token invalid - force logout
      setSession(null);
      localStorage.removeItem("session");
      deleteCookie("session_token");
      window.location.href = "/login";
    }
  };

  // Validate every 5 minutes
  const validationInterval = setInterval(validateTokenPeriodically, 5 * 60 * 1000);
  return () => clearInterval(validationInterval);
}, [session?.id]);
```

### Backend Token Validation

```javascript
// server/controllers/session.controller.js

const sessionValidateToken = async (req, res) => {
  const TOKEN = req.query.token;

  if (!TOKEN) {
    return res.status(400).json({
      status: 'error',
      data: null,
      message: 'Session token is required'
    });
  }

  try {
    // Look up session in database
    const SESSION = await DB.collection("sessions").findOne({
      session_token: TOKEN
    });

    if (!SESSION) {
      return res.status(401).json({
        status: 'error',
        data: null,
        message: 'Invalid session token'
      });
    }

    // Get associated user
    const USER = await DB.collection("users").findOne({
      _id: new ObjectId(SESSION.user_id)
    });

    if (!USER) {
      return res.status(401).json({
        status: 'error',
        data: null,
        message: 'Invalid user session'
      });
    }

    // Token is valid - return user info
    const { _id, first_name, last_name, auth_level } = USER;
    return res.status(200).json({
      status: 'ok',
      data: {
        valid: true,
        user: {
          id: _id.toString(),
          first_name,
          last_name,
          auth_level
        }
      },
      message: 'Token is valid'
    });
  } catch (error) {
    console.error("Error validating token:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};
```

---

## Token Expiration & Refresh

### How Token Expiration Works

1. **MongoDB TTL Index** - Sessions collection has TTL set to 24 hours
2. **Automatic Cleanup** - MongoDB automatically removes expired sessions
3. **No Explicit Refresh** - Tokens don't refresh; users must re-login after 24 hours
4. **Periodic Validation** - Every 5 minutes, frontend checks if token still exists

### Session TTL Configuration

```javascript
// MongoDB command to set up TTL index
// This ensures sessions expire after 24 hours
db.sessions.createIndex(
  { "session_date": 1 },
  { "expireAfterSeconds": 86400 }  // 24 hours in seconds
);

// Or in backend initialization:
const sessionsCollection = DB.collection("sessions");
await sessionsCollection.createIndex(
  { "session_date": 1 },
  { "expireAfterSeconds": 86400 }
);
```

### What Happens When Token Expires

```javascript
// Frontend validation detects expired token
const response = await fetch(
  `http://localhost:5050/validate_token?token=${token}`,
  { method: "GET", credentials: "include" }
);

// Backend returns 401 - session not found
if (!validateResponse.ok) {
  // Clear all local session data
  localStorage.removeItem("session");
  deleteCookie("session_token");
  
  // Redirect to login
  window.location.href = "/login";
  
  // Show message to user
  showToast("Your session has expired. Please log in again.", "warning");
}
```

### Is Refresh Token Needed?

Currently, **NO**. The application uses a simple 24-hour expiration:
- ✅ Simple to implement and maintain
- ✅ Better security (shorter-lived tokens)
- ✅ Clear user experience (users know token lasts 24 hours)
- ⚠️ Users need to re-login after 24 hours (acceptable trade-off)

---

## Logout & Cleanup

### Logout Flow

```javascript
const logoutUser = async () => {
  try {
    const token = getCookie("session_token");
    
    if (token) {
      // Notify backend to delete session
      const response = await fetch(
        `http://localhost:5050/session/logout?token=${encodeURIComponent(token)}`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      if (response.ok) {
        console.log("Logged out successfully");
      }
    }

    // Clear all frontend session data
    localStorage.removeItem("session");
    deleteCookie("session_token");
    
    // Update context
    setSession(null);
    setIsOnline(false);

    // Redirect to login
    window.location.href = "/login";
    
  } catch (error) {
    console.error("Logout failed:", error);
    // Even if request fails, clear local data
    localStorage.removeItem("session");
    deleteCookie("session_token");
    window.location.href = "/login";
  }
};
```

### Backend Logout

```javascript
const sessionLogout = async (req, res) => {
  const TOKEN = req.query.token;

  if (!TOKEN) {
    return res.status(400).json({
      error: "Session token is required"
    });
  }

  try {
    // Find the session
    const SESSION = await DB.collection("sessions").findOne({
      session_token: TOKEN
    });

    if (!SESSION) {
      return res.status(404).json({
        error: "Invalid or non-existent session token"
      });
    }

    // Mark user as offline
    await DB.collection("users").updateOne(
      { _id: new ObjectId(SESSION.user_id) },
      { $set: { isOnline: false, lastSeen: new Date() } }
    );

    // Delete session from database (TOKEN INVALIDATED)
    await DB.collection("sessions").deleteOne({
      session_token: TOKEN
    });

    return res.status(200).json({
      message: "Successfully logged out"
    });

  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};
```

---

## Error Handling

### Common Authentication Errors

| Scenario | HTTP Status | Error Message | Solution |
|----------|-------------|---------------|----------|
| Missing credentials | 400 | "Email and password are required" | Provide both fields in login request |
| Invalid credentials | 401 | "Invalid email or password" | Check spelling of email and password |
| Email already exists | 400 | "Email already exists" | Use different email for registration |
| Token expired | 401 | "Invalid session token" | User must re-login |
| Token missing | 400 | "Session token is required" | Ensure token is passed as query param |
| User deleted | 401 | "Invalid user session" | User was removed from database |
| No token in cookie | 401 | "Token not found" | User is not logged in |

### Error Handling Best Practices

```javascript
const authenticatedFetch = async (url, options = {}) => {
  try {
    // Get token
    const token = getCookie("session_token");
    
    if (!token) {
      throw new Error("No session token found");
    }

    // Add token to query params
    const urlWithToken = new URL(url);
    urlWithToken.searchParams.append("token", token);

    // Make request
    const response = await fetch(urlWithToken.toString(), {
      credentials: "include",
      ...options
    });

    // Handle different status codes
    if (response.status === 401) {
      // Unauthorized - clear session and redirect
      localStorage.removeItem("session");
      deleteCookie("session_token");
      window.location.href = "/login";
      throw new Error("Session expired or invalid");
    }

    if (response.status === 403) {
      // Forbidden - user doesn't have permission
      throw new Error("You don't have permission to access this resource");
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Request failed");
    }

    return await response.json();

  } catch (error) {
    console.error("Authenticated fetch error:", error);
    throw error;
  }
};

// Usage
try {
  const data = await authenticatedFetch("http://localhost:5050/validate_token");
  console.log("Session valid:", data);
} catch (error) {
  console.error("Authentication error:", error.message);
  showToast(error.message, "error");
}
```

---

## Best Practices

### 1. Always Check Response Status

```javascript
// ✅ CORRECT
const response = await fetch(url);
if (!response.ok) {
  const error = await response.json();
  console.error("Error:", error.message);
  return;
}
const data = await response.json();

// ❌ WRONG - Assumes success without checking
const data = await response.json();
console.log(data.user.name);  // May crash if response was error
```

### 2. Handle Token Expiration Gracefully

```javascript
// ✅ CORRECT - Catches expiration and redirects
const validateToken = async (token) => {
  try {
    const response = await fetch(
      `http://localhost:5050/validate_token?token=${encodeURIComponent(token)}`,
      { method: "GET", credentials: "include" }
    );

    if (response.status === 401) {
      // Token expired
      localStorage.removeItem("session");
      deleteCookie("session_token");
      return false;
    }

    return response.ok;
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
};
```

### 3. Encode URL Parameters

```javascript
// ✅ CORRECT - Handles special characters
const token = getCookie("session_token");
const url = `validate_token?token=${encodeURIComponent(token)}`;

// ❌ WRONG - May break with special characters
const url = `validate_token?token=${token}`;
```

### 4. Use `credentials: "include"` for Cookie Requests

```javascript
// ✅ CORRECT - Includes cookies automatically
const response = await fetch(url, {
  credentials: "include"
});

// ❌ WRONG - Cookies not sent
const response = await fetch(url);
```

### 5. Never Store Sensitive Data in LocalStorage

```javascript
// ✅ CORRECT - Only store user metadata
localStorage.setItem("session", JSON.stringify({
  id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  auth_level: user.auth_level
}));

// ❌ WRONG - Storing token and passwords in localStorage
localStorage.setItem("session_token", token);  // Never do this!
localStorage.setItem("password", password);    // Never do this!
```

### 6. Always Validate on Protected Routes

```javascript
// ✅ CORRECT - Validates before rendering
const ProtectedComponent = () => {
  const [isValid, setIsValid] = useState(false);
  
  useEffect(() => {
    const validateToken = async () => {
      const token = getCookie("session_token");
      const response = await fetch(
        `http://localhost:5050/validate_token?token=${encodeURIComponent(token)}`,
        { method: "GET", credentials: "include" }
      );
      setIsValid(response.ok);
    };
    validateToken();
  }, []);

  if (!isValid) return <Navigate to="/login" />;
  return <ProtectedContent />;
};

// ❌ WRONG - Assumes token is valid
const BadComponent = () => {
  return <ProtectedContent />;  // No validation!
};
```

### 7. Implement Activity Tracking

```javascript
// ✅ CORRECT - Tracks user activity
useEffect(() => {
  if (!session?.id) return;

  const pingServer = async () => {
    await fetch("http://localhost:5050/user/ping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.id })
    });
  };

  pingServer();  // Initial ping
  const interval = setInterval(pingServer, 30000);  // Every 30 seconds
  return () => clearInterval(interval);
}, [session?.id]);
```

### 8. Set Appropriate Timeout Values

```javascript
// ✅ CORRECT - Set reasonable timeouts
const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};
```

---

## Reference

### Key Files

- **Frontend Session Context:** `client/src/context/SessionContext.jsx`
- **Protected Route Component:** `client/src/components/ProtectedRoute.jsx`
- **Backend Session Controller:** `server/controllers/session.controller.js`
- **Session Routes:** `server/routes/session.routes.js`
- **User Routes:** `server/routes/user.routes.js`

### Relevant Endpoints

- `POST /session/login` — User login
- `POST /session/logout` — User logout
- `GET /validate_token` — Validate session token
- `POST /user/ping` — Record user activity
- `POST /user/register` — User registration

### Related Documentation

- [API Endpoints Summary](WIREFRAME_ANALYSIS.md)
- [Session Token Validation](SESSION_TOKEN_VALIDATION.md)
- Main README: [CodeBloggs](../README.md)
