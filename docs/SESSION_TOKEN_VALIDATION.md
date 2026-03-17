# Session Token Validation & Access Control Flow

**Last Updated:** March 17, 2026  
**Purpose:** Comprehensive documentation of how session token validation works to prevent unauthorized access to protected pages after logout.

---

## 📋 Overview

The application implements a **three-layer security model** to ensure users cannot access protected pages once logged out:

1. **Client-Side Protection** - ProtectedRoute component validates on every navigation
2. **Server-Side Validation** - Backend confirms token exists and is valid
3. **Time-Based Validation** - Periodic background checks every 5 minutes

---

## 🔐 Layer 1: ProtectedRoute Component (On Navigation)

### How It Works

```
User navigates to protected page (Home, Admin, etc.)
    ↓
ProtectedRoute component mounts/updates
    ↓
useEffect triggers and calls validateTokenOnNavigation()
    ↓
Retrieves session_token from browser cookies
    ↓
Sends GET request to backend: /validate_token?token=xxx
    ↓
Backend validates token exists in sessions collection
    ↓
If valid → setIsValid(true) → renders protected component ✅
If invalid/expired → setIsValid(false) → redirects to /login ❌
```

### Key Features

- **Validates on every protected page navigation** - Not just on app load
- **Extracts token from cookies** - Secure, HTTP-only storage
- **Backend verification** - Doesn't trust client-side token alone
- **Instant redirect** - No delay in redirecting to login
- **Loading state** - Shows "Loading..." while validation occurs

### Code Location

`client/src/components/ProtectedRoute.jsx` - Lines ~30-90

---

## 🔄 Layer 2: SessionContext Token Validation (Periodic)

### How It Works

```
Every 5 minutes (300,000ms) while user is logged in:
    ↓
validateTokenPeriodically() runs automatically
    ↓
Checks if session_token cookie still exists
    ↓
Validates token with backend again
    ↓
If token is invalid/expired:
    - Sets session to null
    - Clears cookies
    - Clears localStorage
    - User is instantly logged out ✅
```

### Key Features

- **Background validation** - Doesn't interrupt user activity
- **5-minute intervals** - Catches expired tokens quickly
- **Automatic logout** - No manual action needed
- **Graceful degradation** - Doesn't logout on network errors
- **Auto-cleanup** - Removes all session data if token invalid

### Code Location

`client/src/context/SessionContext.jsx` - Lines ~145-200

---

## ❌ Layer 3: Logout Flow

### When User Clicks Logout

```
User clicks Logout button
    ↓
logout() function executes:
    1. Calls backend: /session/logout (invalidates token server-side)
    2. Clears session from state (session = null)
    3. Deletes session_token cookie
    4. Clears localStorage
    ↓
User redirected to /login
    ↓
If they try to navigate back to protected page:
    - ProtectedRoute checks: !session → true
    - ProtectedRoute checks: !isValid → true (no token to validate)
    - Redirect to /login ❌
```

### Data Cleanup on Logout

| Storage | Action | Result |
|---------|--------|--------|
| **React State** | `session = null` | No session object exists |
| **Cookie** | Deleted with expiration date | No token in browser |
| **localStorage** | `localStorage.removeItem("session")` | No backup data |
| **Server** | `/session/logout` endpoint called | Session invalidated server-side |

### Code Location

`client/src/context/SessionContext.jsx` - Line ~220

---

## ✅ Why It Works - The Triple Check System

| Check Point | When | What Happens | Why It Works |
|-------------|------|--------------|--------------|
| **Initial Access** | Page load | Token validated from cookies | User can't bypass auth on route change |
| **Navigation** | Every route change to protected page | Token re-validated before component renders | Can't reuse old token after logout |
| **Periodic** | Every 5 minutes in background | Background validation, logs out if invalid | Catches token expiration automatically |
| **After Logout** | Any attempt to access protected page | No session + no valid token = redirect | Complete lockdown after logout |

---

## 🚫 After Logout - Why Access Denied Works

### Once Logout Completes

1. **Token is deleted server-side** 
   - Backend marks session expired
   - `/session/logout` endpoint removes session from database

2. **Cookie is deleted client-side** 
   - `document.cookie = "session_token=;expires=Thu, 01 Jan 1970..."`
   - Browser removes all session cookies

3. **Session state cleared** 
   - `session = null` in React state
   - No session object to reference

4. **localStorage cleared** 
   - Removed session data backup
   - No fallback authentication

### Protected Page Access Check

```javascript
// ProtectedRoute component on protected route
if (loading || isValidating) { 
  return <Loading /> 
}

// After validation completes:
if (!session || !isValid) {
  return <Navigate to="/login" replace /> // ❌ BLOCKED - Cannot proceed
}

return children; // This line never reaches
```

**Both conditions must be true to render protected content:**
- `session` must exist (contains user data) ✓
- `isValid` must be true (token is valid) ✓

**If either is false → redirect to /login**

---

## 🔄 Complete Protection Flow: Logged Out User Tries /admin

```
LOGGED OUT USER NAVIGATES TO /ADMIN:

Step 1: URL Changes
    → Router detects navigation to /admin

Step 2: ProtectedRoute Component Mounts
    → Renders <ProtectedRoute>
    → Children = <Admin /> component code

Step 3: useEffect Triggers
    → Calls validateTokenOnNavigation()
    → Sets isValidating = true
    → Shows "Loading..." message

Step 4: Token Extraction
    → document.cookie.split(";")
    → Looks for cookie named "session_token"
    → No cookie found (deleted on logout)
    → token = null

Step 5: Early Return
    → if (!token) {
        → setIsValid(false)
        → setIsValidating(false)
        → return
      }

Step 6: State Check
    → isValidating = false
    → loading = false
    → session = null (from logout)
    → isValid = false

Step 7: Conditional Rendering
    → if (!session || !isValid) → TRUE (both are falsy)
    → Execute: <Navigate to="/login" replace />

Step 8: Redirect
    → User redirected to /login page
    → Access to /admin DENIED ✓
    → User sees login form
```

---

## 📊 Security Comparison

### Before Token Validation Enhancement

| Scenario | Status | Issue |
|----------|--------|-------|
| Fresh logout, immediate /admin access | ❌ BLOCKED | Protected by ProtectedRoute |
| Logout, token expires in 24h, access after | ✅ ACCESSIBLE | **SECURITY RISK** |
| Backend token invalidated but browser cached | ✅ ACCESSIBLE | **SECURITY RISK** |

### After Token Validation Enhancement

| Scenario | Status | Issue |
|----------|--------|-------|
| Fresh logout, immediate /admin access | ❌ BLOCKED | Protected by ProtectedRoute |
| Logout, token expires in 24h, access after | ❌ BLOCKED | Catches expired token |
| Backend token invalidated but browser cached | ❌ BLOCKED | Periodic validation validates |
| Browser cache cleared but server knows logout | ❌ BLOCKED | Server-side session lookup |

---

## 🔑 Key Components

### ProtectedRoute.jsx
- **Purpose:** Guards routes requiring authentication
- **Validates on:** Every protected page navigation
- **Action on invalid:** Redirects to /login
- **State management:** Tracks `isValidating` and `isValid`

### SessionContext.jsx
- **Purpose:** Manages global session state
- **Validates on:** Every 5 minutes (background)
- **Action on invalid:** Clears session, logs user out
- **State management:** Tracks `session` and lifecycle

### Validation Endpoint
- **Backend:** `GET /validate_token?token=xxx`
- **Checks:** Token exists in sessions collection
- **Returns:** `{ status: "ok", data: { valid: true/false } }`
- **Security:** Verifies on server, not client

---

## 🎯 What Prevents Unauthorized Access

### 1. **Token Deletion**
- Cookie deleted immediately on logout
- Cookie set to expire in 1970 (effectively deleted)
- Browser clears the token

### 2. **Server-Side Session Invalidation**
- Backend `/session/logout` endpoint called
- Session record removed from database
- Even if client had old token, server won't recognize it

### 3. **Multiple Validation Points**
- Navigation validation in ProtectedRoute
- Periodic validation in SessionContext
- Backend validation on every request

### 4. **State Cleanup**
- React state cleared (`session = null`)
- localStorage cleared
- No fallback authentication data

### 5. **No Client-Side Fallback**
- Can't fake session in localStorage only
- Can't fake session in state only
- Both must exist AND token must validate

---

## 🧪 Testing the Security

### Test 1: Logout Then Navigate
```
1. Login to application
2. Click "Go to Admin" (works)
3. Click "Logout"
4. Click browser back button
5. Try to access /admin manually
Expected: Redirected to /login ✓
```

### Test 2: Token Expiration
```
1. Login to application
2. Wait for token to expire (or simulate in backend)
3. Navigate to any protected page
4. Check if redirected to /login
Expected: Redirected to /login ✓
```

### Test 3: Clear Cookies Then Access
```
1. Login to application
2. Open DevTools → Application → Cookies
3. Delete "session_token" cookie
4. Navigate to protected page
5. Check if redirected to /login
Expected: Redirected to /login ✓
```

### Test 4: Periodic Validation Catches Logout
```
1. Login to application
2. In another terminal, manually invalidate token in MongoDB
3. Wait up to 5 minutes
4. Observe user automatically logged out
Expected: User redirected to /login within 5 minutes ✓
```

---

## 📝 Implementation Checklist

- [x] ProtectedRoute validates on every navigation
- [x] SessionContext validates every 5 minutes
- [x] Logout clears token from cookies
- [x] Logout clears session from state
- [x] Logout clears data from localStorage
- [x] Backend /validate_token endpoint checks server-side
- [x] Backend validates token in sessions collection
- [x] Invalid tokens trigger immediate logout
- [x] Expired tokens trigger immediate logout
- [x] No fallback authentication methods
- [x] Multiple layers of access control

---

## 🚀 Future Enhancements

1. **Rate limiting** on validation endpoint to prevent brute force
2. **Audit logging** to track when tokens are invalidated
3. **Device tracking** to invalidate sessions on suspicious activity
4. **Token refresh mechanism** to extend sessions without re-login
5. **Real-time logout** across all devices when logging out from one device

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `client/src/components/ProtectedRoute.jsx` | On-navigation validation |
| `client/src/context/SessionContext.jsx` | Periodic validation & state management |
| `server/routes/session.routes.js` | Session endpoints (validate, logout) |
| `server/controllers/session.controller.js` | Session logic |
| `server/db/schemas/session.schema.js` | Session data model |

---

## 🔗 Related Documentation

- Session Management Overview
- Authentication Flow
- Token Storage Best Practices
- Backend Session Endpoints

---

**Document Version:** 1.0  
**Reviewed by:** Development Team  
**Next Review:** April 2026
