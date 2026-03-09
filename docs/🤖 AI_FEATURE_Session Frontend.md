🤖 AI_FEATURE_Session Frontend

---

## Feature Identity

- **Feature Name:** Session Frontend
- **Related Area:** Frontend / Authentication

---

## Feature Goal

Manage user sessions on the frontend by storing session tokens, validating tokens on every page navigation, and controlling access to protected pages based on session validity. Ensure users are logged out and returned to the login page when their session is invalid or when they explicitly log out.

---

## Feature Scope

### In Scope (Included)

- Store session token after successful login (in cookie or localStorage)
- Check for valid session token on app initialization and page navigation
- Display login page only if no valid session token exists
- Protect all authenticated pages (Home, Bloggs, Network, Admin) with session validation
- Logout functionality that clears session token and redirects to login
- Handle expired or invalid tokens gracefully
- Prevent access to authenticated pages without valid session token
- Persist session across page refreshes (token remains in storage)

### Out of Scope (Excluded)

- Token refresh/renewal logic (tokens do not expire during session)
- Session timeout after inactivity
- Multiple device session management
- Session analytics or logging
- Backend session management (handled by backend feature)
- Password reset or account recovery

---

## Sub-Requirements (Feature Breakdown)

- Session token is stored in cookie or localStorage after successful login
- Session token is retrieved from storage on app initialization
- Every page validates the session token before rendering authenticated content
- Login page is displayed only if no valid session token exists in storage
- Protected pages (Home, Bloggs, Network, Admin) check for valid session before rendering
- Invalid or missing tokens redirect user to login page
- User details (id, first_name, last_name, auth_level) are stored alongside token
- Logout request is sent to POST /logout endpoint with session token
- Session token is cleared from storage after logout
- User is redirected to /login page after logout
- Session persists across browser page refreshes

---

## User Flow / Logic (High Level)

1. **App Initialization:**
   - App.jsx loads and checks for session token in storage
   - If token exists → validate token with backend
   - If token is valid → allow access to authenticated pages
   - If token is invalid/missing → display login page

2. **User Logs In (from Login Page feature):**
   - Login request receives session token from backend
   - Session token is stored in cookie or localStorage
   - User details are stored in client storage
   - User is redirected to /home page

3. **User Navigates Between Pages:**
   - Every page renders, it checks for valid session token
   - If token exists and is valid → render page content
   - If token is missing or invalid → redirect to login

4. **User Refreshes Page:**
   - App initialization checks for token in storage
   - Token is retrieved and validated
   - Page renders with same session (no need to login again)

5. **User Clicks Logout:**
   - POST /logout request is sent with session token
   - Session token is cleared from storage
   - User is redirected to /login page
   - All user details are removed from storage

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- App.jsx — Main app component that checks session on initialization
- ProtectedRoute.jsx (optional) — Route wrapper that validates session before rendering
- Navbar.jsx — Contains logout button

**Logic:**
- Session check middleware/hook that runs on app load
- Session validation before rendering protected pages
- Redirect logic for invalid sessions

### Backend / API

- `POST /logout` — Clear session on backend
  - Input: `session_token` (optional, can be sent in body or header)
  - Output: `{ message: "Successfully logged out" }`
  - Status codes:
    - 200 — successful logout
    - 400 — missing session token
    - 404 — session not found

---

## Data Used or Modified

**Session Data (Stored in Cookie/localStorage):**
- `session_token` (string, unique identifier)
- `user_id` (ObjectId, from login response)
- `first_name` (string, from login response)
- `last_name` (string, from login response)
- `auth_level` (string: 'basic' or 'admin', from login response)

**Storage Method:**
- Cookie or localStorage (with key prefix like "codebloggs_")
- Example keys:
  - `codebloggs_session_token`
  - `codebloggs_user_id`
  - `codebloggs_user_details`

**Validations:**
- Session token must not be empty
- Session token must exist before accessing protected pages
- User details must be complete (id, auth_level, etc.)

---

## Tech Constraints (Feature-Level)

- Store session token in cookie (with httpOnly flag for security) or localStorage
- Use React Router for page navigation and redirects
- Implement session check in App.jsx or a custom hook
- Create optional ProtectedRoute component for route-level validation
- Check session token before rendering each page
- Use conditional rendering to show/hide login vs. authenticated layouts
- Store user details in React Context or state for app-wide access (optional)
- Do not log session token to console in production
- Validate token on every critical action (especially before API calls)

---

## Acceptance Criteria

- [ ] Session token is stored in cookie or localStorage after successful login
- [ ] User details (id, first_name, last_name, auth_level) are stored after login
- [ ] App checks for session token on initialization
- [ ] Login page is displayed if no session token exists
- [ ] Authenticated pages are displayed if valid session token exists
- [ ] Invalid session token redirects to login page
- [ ] Missing session token redirects to login page
- [ ] Session token persists across page refresh
- [ ] User can access authenticated pages after refresh without re-logging in
- [ ] Logout button is available in header/navbar
- [ ] Clicking logout sends POST /logout request with session token
- [ ] Session token is cleared from storage after logout
- [ ] User is redirected to /login page after logout
- [ ] All user details are cleared from storage after logout
- [ ] Protected pages cannot be accessed without session token (redirect to login)
- [ ] Navigating to /login when already logged in redirects to /home (optional)
- [ ] No console errors related to session management
- [ ] Session data does not persist after logout (verified by page refresh)

---

## Notes for the AI

- Use a custom hook (e.g., `useSession()`) to manage session logic across components
- Consider using React Context API (e.g., `SessionContext`) to provide session data to all components
- Store token in both cookie (for backend) and localStorage (for frontend checks)
- Always send session token with API requests (in header or body) for backend validation
- Implement a session check on app load that runs before render (use useEffect in App.jsx)
- Use ProtectedRoute wrapper component for cleaner route protection
- Handle network errors gracefully when checking session validity
- Do not block user interaction while validating session (use loading state if needed)
- Consider adding a token expiration check when token is retrieved from storage
- The logout function should be called from the Navbar component (via logout button)
- Store user details in a global state (Context or Redux) for easy access throughout the app
- When session is invalid, clear all stored data (token, user details, etc.)
- Redirect to /login should use React Router's navigate() function
