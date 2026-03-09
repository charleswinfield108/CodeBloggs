# 🤖🛠️ AI Feature Specification - Layout Structure

**Feature Goal:** Establish the foundational application layout with a header, left navigation panel, and main content area. Login and Registration pages remain independent without the header or navigation.

---

## 📋 Scope

### In Scope
- Header component (visible on dashboard pages: Home, Blogs, Network, Admin)
- Left-side navigation panel (sidebar)
- Main content area on the right side
- Layout structure for protected routes
- Independent layouts for Login and Registration pages
- Responsive grid/flexbox layout structure

### Out of Scope
- Navigation styling customization (beyond basic structure)
- Mobile responsive breakpoints (v2 feature)
- Header content/branding (handled separately)
- Navigation link functionality details (handled by respective page features)

---

## 🎯 Requirements Breakdown

### 1. Layout Structure - Header + Sidebar + Content
**Requirement:** The app layout must follow this structure:
- A header at the top
- Under the header, a left-side navigation panel
- A right-side main content area next to the navigation panel

**User Flow:**
1. User logs in successfully
2. User is redirected to `/home`
3. User sees header at top, sidebar on left, content area on right
4. Layout persists across Home, Blogs, Network, Admin pages
5. Header and sidebar always remain visible

**Implementation Details:**
- Use CSS Grid or Flexbox for layout
- Header height: 80px
- Sidebar width: 250px (fixed)
- Remaining space: main content area
- Layout should fill entire viewport (100vh)

---

### 2. Login Page Layout (Independent)
**Requirement:** The Login page is independent from the main layout and must not display the header or left navigation.

**User Flow:**
1. User navigates to `/login`
2. Full-screen centered login card displays
3. No header visible
4. No sidebar visible
5. Full width available for login form

**Implementation Details:**
- Use standalone layout for `/login` route
- Center card on page
- No grid/sidebar structure needed
- Full viewport height usage

---

### 3. Registration Page Layout (Independent)
**Requirement:** The Registration page is independent from the main layout and must not display the header or left navigation.

**User Flow:**
1. User navigates to `/register`
2. Full-screen centered registration card displays
3. No header visible
4. No sidebar visible
5. Full width available for registration form

**Implementation Details:**
- Use standalone layout for `/register` route
- Center card on page
- No grid/sidebar structure needed
- Full viewport height usage

---

### 4. Header Implemented
**Requirement:** The header is always visible on all main pages (Home, Blogs, Network, Admin) and hidden on Login and Register pages.

**Specification:**
- Height: 80px
- Background: #8D88EA (CodeBloggs primary purple)
- Position: Fixed at top of page
- Z-index: Greater than sidebar/content
- Contains: Logo and/or title placeholders (to be filled by other features)
- Visibility: Only on protected routes (Home, Blogs, Network, Admin)

---

### 5. Left Navigation Panel
**Requirement:** A left-side navigation panel appears directly beneath the header.

**Specification:**
- Width: 250px (fixed)
- Background: #F6F7FF (CodeBloggs light background)
- Position: Fixed on left, below header
- Height: Calculated as (100vh - 80px header) 
- Border-right: 1px solid #E3E6F5
- Margin-top: 80px (below header)
- Contains: Navigation links (Home, Blogs, Network, Admin)

---

### 6. Main Content Area
**Requirement:** The main section area is displayed on the right side, next to the navigation panel, and will contain the Home, Blogs, Network and Admin content.

**Specification:**
- Position: Right side of sidebar
- Width: Calculated as (100% - 250px sidebar width)
- Height: 100vh
- Margin-left: 250px
- Margin-top: 80px (below header)
- Background: White or light gray (#FFFFFF or #F9F9F9)
- Padding: 2rem (32px)
- Overflow: Auto (for scrollable content)

---

## 🗂️ Interfaces Involved

### Pages/Components

#### Layout Component (`/client/src/components/Layout.jsx`)
**Purpose:** Wrapper component that provides the header + sidebar + content structure for authenticated pages

**Props:**
- `children`: React components to render in main content area

**Exports:**
- `Layout` component

#### Header Component (`/client/src/components/Header.jsx`)
**Purpose:** Top navigation bar visible on all main pages

**Props:**
- None (initial version)

**Children:**
- Logo/branding area
- (Future: User profile, settings)

#### Sidebar Component (`/client/src/components/Sidebar.jsx`)
**Purpose:** Left navigation panel on authenticated pages

**Props:**
- None (initial version)

**Children:**
- Navigation links:
  - Home
  - Blogs
  - Network
  - Admin (will be conditional based on auth_level)

### Routes

#### Current Routes (Updated)
- `/` → Redirect to `/login`
- `/login` → Login.jsx (standalone layout)
- `/register` → Register.jsx (standalone layout)
- `/home` → Layout wrapper with Home content
- `/blogs` → Layout wrapper with Blogs content
- `/network` → Layout wrapper with Network content
- `/admin` → Layout wrapper with Admin content (conditional)

---

## 📊 Data & Validations

### Data Used
- `auth_level` from SessionContext (to determine if Admin link shows)
- User session status (to verify protected routes)

### Validations
- User must be authenticated (session exists in localStorage) to see Header/Sidebar/Layout
- Non-authenticated users redirected to `/login`
- Admin routes only visible if `auth_level === 'admin'`

### Expected Behavior
- Layout persists during navigation between main pages
- Layout disappears when navigating to `/login` or `/register`
- Sidebar responsive to auth_level (Admin link shows/hides appropriately)

---

## ✅ Acceptance Criteria

### How to Verify It Works

#### Criteria 1: Header Visibility
- [ ] Navigate to `/home` → Header appears at top with 80px height and #8D88EA background
- [ ] Navigate to `/login` → Header disappears, full-screen centered login form
- [ ] Navigate to `/register` → Header disappears, full-screen centered registration form
- [ ] Navigate to `/blogs` → Header appears
- [ ] Navigate to `/network` → Header appears
- [ ] Navigate to `/admin` (if auth_level='admin') → Header appears

#### Criteria 2: Sidebar Visibility and Structure
- [ ] On `/home` → Sidebar appears on left with 250px width and #F6F7FF background
- [ ] Sidebar positioned directly under header (margin-top: 80px)
- [ ] Sidebar has right border (#E3E6F5)
- [ ] Sidebar displays navigation links: Home, Blogs, Network, Admin
- [ ] On `/login` and `/register` → Sidebar is hidden
- [ ] On `/blogs`, `/network`, `/admin` → Sidebar visible with appropriate styling

#### Criteria 3: Main Content Area
- [ ] Content area positioned right of sidebar (margin-left: 250px)
- [ ] Content area starts below header (margin-top: 80px)
- [ ] Content area fills remaining viewport space
- [ ] Content area has white/light background and 2rem padding
- [ ] Content scrolls independently if overflowing
- [ ] Different page content (Home, Blogs, Network, Admin) displays correctly in this area

#### Criteria 4: Layout Consistency
- [ ] Navigating between `/home`, `/blogs`, `/network`, `/admin` maintains header and sidebar
- [ ] No flash or layout shift when navigating between main pages
- [ ] Layout responsive to window resize

#### Criteria 5: Authentication-Aware Behavior
- [ ] Non-authenticated users cannot directly access `/home` (redirected to `/login`)
- [ ] After login, users can access `/home` and see full layout
- [ ] Admin link in sidebar only visible if `auth_level === 'admin'`
- [ ] Logout removes session and redirects to `/login`

---

## 📝 Implementation Checklist

- [ ] Create Layout.jsx component
- [ ] Create Header.jsx component
- [ ] Create Sidebar.jsx component
- [ ] Update router to use Layout wrapper for protected routes
- [ ] Update Home.jsx to work within Layout
- [ ] Create placeholder Blogs, Network, Admin pages
- [ ] Add conditional rendering for Admin link based on auth_level
- [ ] Test navigation between pages maintains layout
- [ ] Test login/logout shows/hides layout
- [ ] Test responsive resize behavior
- [ ] Verify no layout flash during transitions
- [ ] Commit to `layout-feat` branch

---

## 🔗 Related Features

- Login & Registration (uses independent layouts)
- User Session Management (auth_level used for Admin visibility)
- Home Page Content (Primary content for Layout)
- Blogs Feature
- Network Feature
- Admin Feature

---

## 📌 Notes

- Layout is foundational for all authenticated pages
- Color scheme uses CodeBloggs brand colors (#8D88EA, #F6F7FF, #E3E6F5)
- Font: Open Sans (already loaded globally)
- All proportions and spacing follow CodeBloggs design system
