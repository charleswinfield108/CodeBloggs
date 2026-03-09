🤖 AI_FEATURE_Admin Section

---

## Feature Identity

- **Feature Name:** Admin Section
- **Related Area:** Frontend / Pages

---

## Feature Goal

Provide an administrative dashboard accessible only to users with admin privileges. The dashboard contains management cards for user management and content moderation, enabling administrators to oversee community activity and user accounts.

---

## Feature Scope

### In Scope (Included)

- Admin page restricted to users with auth_level = 'admin'
- Redirect to /home if user tries to access without admin privileges
- Display Admin link in navbar only for admin users
- Admin page layout with management cards
- User Manager card (non-functional placeholder for now)
- Content Manager card (non-functional placeholder for now)
- Card titles and descriptions
- Professional styling using Color Palette
- Visual distinction of admin features

### Out of Scope (Excluded)

- Actual user management functionality (delete, edit, ban users)
- Actual content moderation functionality (delete, flag, suppress posts)
- User analytics or statistics
- Moderation logs or activity history
- Report handling or queue
- Admin notification system
- System configuration or settings
- Database backup or export
- User role management
- Permission matrix

---

## Sub-Requirements (Feature Breakdown)

- Admin page is only accessible if user auth_level = 'admin'
- Non-admin users are redirected to /home if attempting to access /admin
- Admin link is only visible in navbar for admin users
- Admin link is hidden in navbar for basic users
- Admin page displays "User Manager" card
- Admin page displays "Content Manager" card
- User Manager card shows title and description
- User Manager card has placeholder text (e.g., "Coming soon" or "Feature in development")
- Content Manager card shows title and description
- Content Manager card has placeholder text
- Cards are visually distinct and well-structured
- Cards use Color Palette styling
- Cards display professional layout on page
- Admin page displays "Admin Dashboard" heading or title

---

## User Flow / Logic (High Level)

1. **Admin User Navigates:**
   - User with auth_level = 'admin' logs in
   - Admin link appears in navbar (visible to admin only)
   - User clicks Admin link in navbar

2. **Admin Page Loads:**
   - Navigate to /admin page
   - Page title/heading displays "Admin Dashboard"
   - Two management cards display:
     - User Manager card
     - Content Manager card
   - Each card shows placeholder content

3. **Non-Admin User Navigation:**
   - User with auth_level = 'basic' logs in
   - Admin link does NOT appear in navbar
   - If user manually navigates to /admin URL:
     - Route protection redirects to /home
     - Or displays "Access Denied" message and link back to /home

4. **Future Enhancement:**
   - Clicking on User Manager card would open user management interface (not implemented yet)
   - Clicking on Content Manager card would open content moderation interface (not implemented yet)

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- Admin.jsx — Main admin page component
- ProtectedRoute.jsx — Route wrapper that checks admin auth level
- AdminCard.jsx (optional) — Reusable card component for management modules

**Page Layout:**
```
┌──────────────────────────────────────┐
│           HEADER                     │
├─────────┬──────────────────────────┤
│  NAV    │    ADMIN DASHBOARD       │
│ Admin▼  ├──────────────────────────┤
│         │                          │
│         │  ┌────────────────────┐  │
│         │  │  User Manager      │  │
│         │  │                    │  │
│         │  │  Manage users,     │  │
│         │  │  roles, and        │  │
│         │  │  permissions.      │  │
│         │  │                    │  │
│         │  │  [Coming Soon]     │  │
│         │  └────────────────────┘  │
│         │                          │
│         │  ┌────────────────────┐  │
│         │  │  Content Manager   │  │
│         │  │                    │  │
│         │  │  Moderate posts,   │  │
│         │  │  comments, and     │  │
│         │  │  reports.          │  │
│         │  │                    │  │
│         │  │  [Coming Soon]     │  │
│         │  └────────────────────┘  │
│         │                          │
│         └──────────────────────────┘
```

**Card Layout (User Manager):**
```
┌──────────────────────────┐
│  User Manager            │
│  ─────────────────────   │
│                          │
│  Manage users, roles,    │
│  and permissions.        │
│                          │
│  [Coming Soon]           │
│                          │
│  [Click to Access]       │
└──────────────────────────┘
```

### Backend / API

- No new backend endpoints required for this feature
- Backend provides auth_level in login response (already implemented)
- Route protection is frontend-based for now

---

## Data Used or Modified

**Input Data (from session):**
- `auth_level` (string: 'basic' or 'admin', from session storage)
- `user_id` (ObjectId, from session storage)

**Logic:**
- Retrieve auth_level from session storage or context
- Check if auth_level === 'admin'
- If admin → render Admin page
- If not admin → redirect to /home or display access denied message

**Validation:**
- Auth_level must equal 'admin' for access
- If auth_level is missing or differs, deny access

---

## Tech Constraints (Feature-Level)

- Use React component (Admin.jsx) for page
- Use ProtectedRoute wrapper or conditional rendering for access control
- Check auth_level from session storage or Context API
- Redirect to /home using React Router's useNavigate if not admin
- Use conditional rendering to show Admin link in navbar only for admin
- All colors must conform to Color Palette
- Card styling should match design system
- Do not implement actual functionality (placeholder only)
- Display clear "Coming Soon" or placeholder messaging
- Ensure proper route protection (prevent URL bypass)

---

## Acceptance Criteria

- [ ] Admin page is accessible only for users with auth_level = 'admin'
- [ ] Admin link appears in navbar for admin users
- [ ] Admin link is hidden in navbar for basic users
- [ ] Admin page displays "Admin Dashboard" title or heading
- [ ] Admin page displays "User Manager" card
- [ ] Admin page displays "Content Manager" card
- [ ] User Manager card shows descriptive text
- [ ] User Manager card shows placeholder message (e.g., "Coming Soon")
- [ ] Content Manager card shows descriptive text
- [ ] Content Manager card shows placeholder message
- [ ] Cards are visually distinct and well-organized
- [ ] Cards use Color Palette colors appropriately
- [ ] Non-admin users are redirected if accessing /admin URL directly
- [ ] Non-admin users see "Access Denied" or similar message (optional)
- [ ] Non-admin users have link back to /home from denied access page
- [ ] Admin link in navbar navigates to /admin correctly
- [ ] Admin page layout is responsive to screen size (desktop)
- [ ] No console errors or warnings
- [ ] Page loads without errors for admin users
- [ ] Route protection prevents unauthorized access

---

## Notes for the AI

- Use ProtectedRoute component or conditional rendering in router config
- ProtectedRoute should check auth_level before rendering Admin page
- If not admin, use useNavigate to redirect to /home
- Alternatively, use conditional rendering in route setup: `auth_level === 'admin' ? <Admin /> : <Navigate to="/home" />`
- Retrieve auth_level from session storage: `sessionStorage.getItem('codebloggs_user_details')`
- Or use Context API (recommended): `const { authLevel } = useAuthContext();`
- Navbar should conditionally render Admin link: `auth_level === 'admin' && <Link to="/admin">Admin</Link>`
- Cards should have:
  - Title (e.g., "User Manager")
  - Description (e.g., "Manage users, roles, and permissions.")
  - Placeholder content (e.g., "Coming Soon", "[Click to Access]")
- Card styling should use CSS with border, padding, background color from palette
- Consider icon for each card (user icon for User Manager, document/flag icon for Content Manager)
- Cards can be clickable (optional, currently just placeholders)
- Keep cards responsive if they're in a grid or flexbox layout
- Page heading could be "Admin Dashboard" or "Administration"
- Consider adding a subtitle: "Community Management and Moderation Tools"
- If implementing clickable cards later, add hover effects (cursor pointer, background change)
- For now, cards are informational/placeholder only
- Ensure auth_level check happens on component mount or during routing
- If auth_level changes (user logs out, another tab logs in), session might not update - consider polling or event listeners
- Optional: Add admin-only header styling or indicator that user is in admin mode
