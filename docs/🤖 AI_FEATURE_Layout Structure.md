🤖 AI_FEATURE_Layout Structure

---

## Feature Identity

- **Feature Name:** Layout Structure
- **Related Area:** Frontend

---

## Feature Goal

Establish a consistent application layout with a header, left-side navigation panel, and main content area for authenticated users. The login and registration pages have independent layouts without the header or navigation panel.

---

## Feature Scope

### In Scope (Included)

- Header component visible on all authenticated pages (Home, Bloggs, Network, Admin)
- Left-side navigation panel directly beneath the header
- Main content area on the right side next to the navigation panel
- Login page with independent layout (no header, no navigation)
- Registration page with independent layout (no header, no navigation)
- Proper routing to show/hide layout components based on current page
- Layout responsive positioning (header spans full width, nav on left, content on right)

### Out of Scope (Excluded)

- Header styling details (covered by Color Palette and component-level features)
- Navigation link functionality (covered by navigation feature)
- Page content implementation (covered by individual page features)
- Mobile or tablet responsive design (desktop layout only)

---

## Sub-Requirements (Feature Breakdown)

- Header component is always visible on main pages and hidden on login/register pages
- Left navigation panel appears directly beneath the header on main pages only
- Main content area positioned to the right of the navigation panel
- Login page displayed without header or navigation
- Registration page displayed without header or navigation
- Layout uses flexbox or grid for proper alignment and spacing
- App.jsx routes components based on page type (authenticated vs. unauthenticated)

---

## User Flow / Logic (High Level)

1. **User not logged in:**
   - User navigates to /login or /register
   - Only the login/register form is displayed
   - No header or navigation panel appears

2. **User logged in (authenticated):**
   - User navigates to /home, /bloggs, /network, or /admin
   - Header appears at the top
   - Left navigation panel appears below the header
   - Main content area displays to the right of the navigation
   - Header always remains visible
   - Navigation remains fixed on the left side

3. **User logs out:**
   - Session is cleared
   - User is redirected to /login
   - Layout switches to login page layout (no header, no nav)

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- App.jsx — Main application component that controls layout rendering
- Header.jsx — Top navigation header (visible on authenticated pages only)
- Navbar.jsx — Left-side navigation panel (visible on authenticated pages only)
- Login.jsx — Login page (independent layout)
- Register.jsx — Registration page (independent layout)
- Home.jsx — Home page (uses main layout)
- Bloggs.jsx — Bloggs page (uses main layout)
- Network.jsx — Network page (uses main layout)
- Admin.jsx — Admin page (uses main layout)

**Layout Structure:**
```
Full Width Container (App.jsx)
├── Login Page (independent, no layout wrapper)
├── Register Page (independent, no layout wrapper)
└── Authenticated Layout (conditional rendering)
    ├── Header (full width)
    └── Flex Container
        ├── Navbar (left side, fixed width)
        └── Main Content (right side, flex-grow)
            ├── Home
            ├── Bloggs
            ├── Network
            └── Admin
```

### Backend / API

- No backend endpoints required for layout structure
- Layout is controlled by frontend routing and conditional rendering

---

## Data Used or Modified

- Session token — determines if user is authenticated
- Current route/path — determines which page and layout to display
- Auth level — determines if Admin link/page is visible

---

## Tech Constraints (Feature-Level)

- Use React Router for client-side routing
- Use React conditional rendering to show/hide layout components
- Use CSS Flexbox or CSS Grid for layout positioning
- Navbar should remain fixed on the left during scrolling (optional but recommended)
- Header spans full width of the page
- All styling must use colors from the Color Palette defined in AI_SPEC

---

## Acceptance Criteria

- [ ] Header is visible on Home, Bloggs, Network, and Admin pages
- [ ] Header is hidden on Login and Register pages
- [ ] Left navigation panel is visible below the header on authenticated pages only
- [ ] Left navigation panel is hidden on Login and Register pages
- [ ] Main content area is positioned to the right of the navigation panel
- [ ] Login page displays without header or navigation
- [ ] Registration page displays without header or navigation
- [ ] Layout uses flexbox/grid for proper alignment
- [ ] No console errors related to layout or routing
- [ ] Session token check determines layout display correctly
- [ ] Switching between authenticated pages maintains header and navigation visibility
- [ ] Logging out removes header and navigation, showing login page

---

## Notes for the AI

- The layout is controlled by the current session token and route
- Conditional rendering in App.jsx should check if a valid session token exists
- Navbar should be positioned as a fixed or sticky left sidebar
- Header should span the full width even when navbar is present
- Login and Register pages are completely independent and should not use the main layout wrapper
- The main content area should be scrollable while header and navbar remain visible
- Ensure proper z-index management if using sticky positioning for header/navbar
