🤖 AI_FEATURE_Navbar

---

## Feature Identity

- **Feature Name:** Navbar (Left-Side Navigation)
- **Related Area:** Frontend / UI Component

---

## Feature Goal

Provide a persistent left-side navigation panel that allows authenticated users to navigate between main application sections (Home, Bloggs, Network, and Admin for privileged users). The navbar should clearly indicate the currently active page and respect user authorization levels.

---

## Feature Scope

### In Scope (Included)

- Left-side navigation panel positioned on all authenticated pages
- Fixed or sticky positioning on left side
- Navigation links to Home, Bloggs, Network, and Admin pages
- Conditional visibility of Admin link based on user auth_level
- Visual highlight of currently active/selected link
- Responsive text and spacing for all links
- Uses Color Palette for styling
- Navigation using React Router
- Navbar hidden on Login and Register pages
- Navbar width consistent across all pages
- Proper spacing between navbar and main content area

### Out of Scope (Excluded)

- Mobile/hamburger menu (desktop layout only)
- Search functionality
- Collapsible/expandable sections
- Icons for links (text only)
- Nested submenus or categories
- Drag-and-drop menu reordering
- Custom link routing based on user role (beyond Admin visibility)

---

## Sub-Requirements (Feature Breakdown)

- Navbar is displayed on left side of page (below header)
- Navbar is always visible on Home, Bloggs, Network, and Admin pages
- Navbar is hidden on Login and Register pages
- Navbar contains link to Home page
- Navbar contains link to Bloggs page
- Navbar contains link to Network page
- Navbar contains link to Admin page (conditional)
- Admin link is only visible if user auth_level equals 'admin'
- Admin link is hidden if user auth_level equals 'basic'
- Currently active page link is visually highlighted
- Active highlight updates when navigating between pages
- All links are clickable and navigate to correct page
- Navbar styling uses colors from Color Palette
- Navbar width is consistent across all pages
- Content area properly positioned to right of navbar

---

## User Flow / Logic (High Level)

1. **User Logs In (authenticated):**
   - User arrives on /home page
   - Header displays at top
   - Navbar displays on left side
   - Home link is highlighted as active

2. **User Clicks Bloggs Link:**
   - Navigate to /bloggs page
   - Navbar remains visible
   - Bloggs link is now highlighted
   - Home link is no longer highlighted

3. **User Clicks Network Link:**
   - Navigate to /network page
   - Navbar remains visible
   - Network link is now highlighted
   - Previous active link is no longer highlighted

4. **User with Admin Auth Level:**
   - Navbar displays with four links (Home, Bloggs, Network, Admin)
   - Admin link is visible and clickable
   - User can click Admin to navigate to /admin page

5. **User with Basic Auth Level:**
   - Navbar displays with three links (Home, Bloggs, Network)
   - Admin link is hidden
   - User cannot access /admin page (route protection also required)

6. **User Navigates Back to Home:**
   - Click Home link in navbar
   - Navigate to /home
   - Home link is highlighted again

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- Navbar.jsx — Main navbar component
- NavLink.jsx (optional) — Individual nav link component with active state

**Navbar Layout:**
```
┌──────────────┐
│   Home       │  ← active (highlighted)
├──────────────┤
│   Bloggs     │
├──────────────┤
│   Network    │
├──────────────┤
│   Admin      │  ← conditional (only if auth_level = 'admin')
└──────────────┘
```

**Positioning:**
- Fixed or sticky position on left side
- Top: below header (starts at header height, e.g., 70px)
- Left: 0
- Width: consistent (e.g., 200px or 15% of screen)
- Height: remaining vertical space (or full height if sticky)

**Styling:**
- Background: Light Gray (#F6F7FF) or Primary Purple (#8D88EA)
- Text color: Navy (#1F2340)
- Active link background: Primary Hover (#6C63D9) or Accent (#2ED3B7)
- Border: Soft Gray (#E3E6F5) on right side
- Padding: 15-20px vertical, 10-15px horizontal per link
- Hover effect: background color change or text emphasis

### Backend / API

- No new endpoints required for navbar
- Backend provides auth_level in session/login response (already implemented)

---

## Data Used or Modified

**Input Data (from session):**
- `auth_level` (string: 'basic' or 'admin', from session storage)
- Current route/pathname (from React Router)

**Logic:**
- Retrieve auth_level from session storage or context
- Compare current route with navbar link routes
- Render Admin link only if auth_level === 'admin'
- Apply active highlight to link matching current route

**Validations:**
- Auth_level must be valid ('basic' or 'admin')
- If auth_level is invalid, do not display Admin link
- Current route must match one of the navbar link routes

---

## Tech Constraints (Feature-Level)

- Use React Router for navigation links (`<Link>` or `<NavLink>`)
- Use `useLocation()` hook to detect current route
- Use conditional rendering (`&&` or ternary) for Admin link visibility
- Retrieve auth_level from session storage or Context API
- Use CSS Flexbox or Grid for navbar layout
- Apply `active` or `className` conditionally based on current route
- All colors must conform to Color Palette
- Navbar height and width should be responsive or flexible
- Do not use hash-based routing (use React Router paths)
- Can use React Router's `NavLink` component for built-in active state styling
- Navbar should remain visible during page scrolling (if using fixed positioning)

---

## Acceptance Criteria

- [ ] Navbar displays on left side of all authenticated pages
- [ ] Navbar does not display on Login or Register pages
- [ ] Navbar is below header, not overlapping
- [ ] Navbar contains Home link
- [ ] Navbar contains Bloggs link
- [ ] Navbar contains Network link
- [ ] Navbar contains Admin link
- [ ] Admin link is visible when user auth_level = 'admin'
- [ ] Admin link is hidden when user auth_level = 'basic'
- [ ] Home link navigates to /home page
- [ ] Bloggs link navigates to /bloggs page
- [ ] Network link navigates to /network page
- [ ] Admin link navigates to /admin page (when visible)
- [ ] Currently active link is visually highlighted distinctly
- [ ] Active highlight updates when navigating between pages
- [ ] Active highlight is accurate (matches current page)
- [ ] Navbar width is consistent across all pages
- [ ] Main content area is positioned to right of navbar
- [ ] No overlap between navbar and main content
- [ ] All links are clickable and responsive
- [ ] Navbar uses colors from Color Palette
- [ ] No console errors or warnings
- [ ] Navigation is smooth (no page flicker)
- [ ] Navbar remains visible during page scrolling (if using fixed position)

---

## Notes for the AI

- Use React Router's `NavLink` component instead of regular `Link` for built-in active state styling
- NavLink automatically adds the `active` class to the current route match
- Use `useLocation()` hook to get the current pathname and compare with link paths
- Store auth_level in session storage, localStorage, or Context API for easy access
- Consider using a Context (e.g., `AuthContext`) to provide auth_level to navbar
- The Admin link should check auth_level === 'admin' before rendering
- Apply CSS class or inline styles to highlight the active link (e.g., background color change)
- The active highlight should be visually distinct (different color, bold text, or background)
- Consider adding hover effects for better UX (lighter background on hover)
- Navbar should be sticky or fixed to remain visible during scrolling
- Use flexbox layout for navbar: `display: flex; flex-direction: column;`
- Ensure proper spacing between links (padding or margin)
- The navbar should have a defined width (not flexible) to keep main content area consistent
- Consider accessibility: ensure links are keyboard-navigable (Tab key)
- If navbar is sticky/fixed, add an overflow property to handle content within navbar if needed
- All link text should be clear and match the page route names (e.g., "Bloggs" not "Blog Feed")
- The active highlight should persist when user refreshes page (relies on current route matching)
