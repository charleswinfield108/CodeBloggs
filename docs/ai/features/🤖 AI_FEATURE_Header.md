🤖 AI_FEATURE_Header

---

## Feature Identity

- **Feature Name:** Header
- **Related Area:** Frontend / UI Component

---

## Feature Goal

Create a persistent header component that appears at the top of all authenticated pages. The header provides navigation to home, a button to create posts, and a user menu with logout and account settings options. The header serves as the primary control center for user interactions.

---

## Feature Scope

### In Scope (Included)

- Header component that displays on all authenticated pages (Home, Bloggs, Network, Admin)
- CodeBloggs logo in header that links to /home page
- "Post" button that opens the Post Modal overlay
- Username display next to user menu
- Collapsible user menu (dropdown/popover) with two options: Logout and Account Settings
- Logout functionality that clears session token and redirects to /login
- Account Settings option that displays a toast notification
- Header spans full width of page
- Header remains visible and fixed at top during scrolling (optional)
- Responsive header styling using Color Palette

### Out of Scope (Excluded)

- Profile picture or avatar display (placeholder: initials only)
- Search functionality or search bar
- Notifications or bell icon
- Real Account Settings page (just toast for now)
- Header customization or theming
- Translation/internationalization
- Accessibility features (covered separately)

---

## Sub-Requirements (Feature Breakdown)

- Logo is displayed on the left side of header and links to /home
- "Post" button is centered or positioned prominently in header
- Username display shows the current user's name from session data
- User menu button (icon or dropdown trigger) appears next to username
- User menu is collapsed by default
- Clicking user menu button toggles the dropdown open/closed
- Logout option in user menu clears session token from storage
- Logout option sends POST /logout request to backend
- Logout redirects user to /login page after session is cleared
- Account Settings option displays a toast notification on click
- Toast notification message: "Account Settings was clicked" or similar
- Toast notification is dismissible or auto-hides after 3-5 seconds
- Post button click triggers Post Modal visibility (controlled by parent or context)
- Header has no border or subtle bottom border using Soft Gray color
- Header background uses Primary Purple or Light Gray (design choice)
- Header text uses Navy color for good contrast
- Header remains at top of page with fixed or sticky positioning

---

## User Flow / Logic (High Level)

1. **Page Load (Authenticated):**
   - Header displays at top of page
   - Logo, Post button, username, and user menu are visible
   - User menu is closed by default

2. **User Clicks Logo:**
   - Navigate to /home page
   - Header remains visible during navigation

3. **User Clicks Post Button:**
   - Post Modal opens as an overlay
   - Header remains visible behind modal
   - Modal can be closed by clicking outside (handled by Post Modal feature)

4. **User Clicks User Menu Button:**
   - User menu dropdown opens below button
   - Two options visible: "Logout" and "Account Settings"
   - Menu closes if user clicks elsewhere on page

5. **User Clicks Logout:**
   - POST /logout request is sent with session token
   - Session token is cleared from storage
   - User is redirected to /login page
   - Header is removed from view (only login page displays)

6. **User Clicks Account Settings:**
   - Toast notification appears (usually bottom-right corner)
   - Toast shows message: "Account Settings was clicked"
   - Toast auto-hides after 3-5 seconds
   - Dropdown menu closes
   - No page navigation occurs

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- Header.jsx — Main header component
- UserMenu.jsx (optional) — Collapsible user menu dropdown
- Toast/Notification component (optional) — For displaying toast message

**Header Layout:**
```
┌─────────────────────────────────────────────────┐
│ Logo     [Post Button]     Username  [Menu▼]    │
└─────────────────────────────────────────────────┘
     ↓                                        ↓
  /home                            ┌──────────────┐
                                   │ Logout       │
                                   │ Account...   │
                                   └──────────────┘
```

**Header Styling:**
- Full width, fixed or sticky positioning
- Height: 60-70px (standard header height)
- Background: Primary Purple (#8D88EA) or Light Gray (#F6F7FF)
- Text color: Navy (#1F2340)
- Padding: 10-15px on all sides
- Top border or bottom border: Soft Gray (#E3E6F5)

**User Menu:**
- Dropdown positioned below user menu button
- Contains two text links: "Logout" and "Account Settings"
- Closes on outside click or selection
- Styled with background color and hover effects

### Backend / API

- `POST /logout` — Clear session on backend
  - Input: `session_token` (optional)
  - Output: `{ message: "Successfully logged out" }`
  - Status: 200 success, 400/404 error

---

## Data Used or Modified

**Input Data (from session/context):**
- `first_name` (string, from session storage)
- `last_name` (string, from session storage)
- `session_token` (string, from session storage, used for logout)

**Display Data:**
- Username display: `${first_name} ${last_name}` (e.g., "John Doe")

**Actions Performed:**
- Navigate to /home (on logo click)
- Toggle Post Modal visibility (on Post button click)
- Toggle user menu dropdown (on menu button click)
- Send POST /logout request (on logout click)
- Clear session token from storage (after logout)
- Show toast notification (on Account Settings click)
- Navigate to /login (after logout completes)

**Validations:**
- Session token must exist before sending logout request
- Username should not be empty (display fallback if needed)

---

## Tech Constraints (Feature-Level)

- Use React component (Header.jsx) for header display
- Use React Router Link or useNavigate for navigation
- Use conditional rendering to show/hide logout vs. login based on session
- User menu can use HTML `<details>` element or custom dropdown logic
- Use useState for managing menu open/closed state
- Use custom toast library (e.g., React Toastify, custom implementation, or browser notification)
- Post Modal state can be managed by parent component or Context API
- All colors must conform to Color Palette
- Header must be responsive and work on desktop
- Do not reload page on logout (use smooth navigation with React Router)
- Session token should be sent in request headers or body for POST /logout

---

## Acceptance Criteria

- [ ] Header displays on all authenticated pages (Home, Bloggs, Network, Admin)
- [ ] Header does not display on Login or Register pages
- [ ] Header contains CodeBloggs logo on the left
- [ ] Clicking logo navigates to /home page
- [ ] "Post" button is visible in header
- [ ] Clicking Post button opens Post Modal overlay
- [ ] Username is displayed correctly from session data (first_name + last_name)
- [ ] User menu button appears next to username
- [ ] User menu dropdown is closed by default
- [ ] Clicking user menu button toggles dropdown open
- [ ] User menu displays "Logout" option
- [ ] User menu displays "Account Settings" option
- [ ] Clicking "Logout" sends POST /logout request
- [ ] Session token is cleared from storage after logout
- [ ] User is redirected to /login after logout
- [ ] Clicking "Account Settings" displays toast notification
- [ ] Toast notification message relates to Account Settings
- [ ] Toast notification auto-hides after 3-5 seconds or is dismissible
- [ ] Clicking outside user menu closes the dropdown
- [ ] Header background uses Primary Purple or Light Gray color
- [ ] Header text uses Navy color
- [ ] Header is full width of page
- [ ] Header layout is consistent across all pages
- [ ] No console errors or warnings
- [ ] Header remains visible during page scrolling (if using fixed positioning)

---

## Notes for the AI

- The header is a shared component used across all authenticated pages
- Must retrieve first_name and last_name from session storage or context
- The Post Modal state can be managed by parent App.jsx or Context API
- Consider using React Context (e.g., `PostModalContext`) to handle Post Modal visibility
- The user menu can be a simple dropdown or popover component
- Use `useNavigate()` from React Router for navigation
- Logout should clear ALL session data (token, user details, etc.)
- Always send session token with POST /logout for backend validation
- The toast notification can be custom HTML or a library like React Toastify
- Toast should appear in a corner (commonly bottom-right) and be non-blocking
- Consider adding logout confirmation dialog (optional enhancement)
- The header should have consistent padding and alignment across all pages
- Username should handle edge cases (empty names, very long names)
- The Post button should have distinct styling (e.g., Primary color, different from other buttons)
- Use flexbox for header layout (display: flex, justify-content: space-between)
- The user menu button can be a simple button with a dropdown icon or hamburger icon
- Consider keyboard navigation for menu (Enter/Escape keys to open/close)
- Ensure logout works even if Post Modal is open (clean up state properly)
