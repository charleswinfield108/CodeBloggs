🤖 AI_FEATURE_Responsive Design

---

## Feature Identity

- **Feature Name:** Responsive Design
- **Related Area:** Frontend / UX/UI

---

## Feature Goal

Provide an optimal viewing experience across all device sizes and screen widths by implementing responsive design patterns throughout the application. The Responsive Design feature ensures the navbar adapts from vertical layout on desktop to horizontal layout on mobile devices, and other UI elements scale appropriately for different screen sizes.

---

## Feature Scope

### In Scope (Included)

- Responsive navbar that adapts to screen width
- Vertical navbar on desktop (large screens, width >= breakpoint)
- Horizontal navbar on mobile (small screens, width < breakpoint)
- Configurable responsive breakpoint (e.g., 768px or 1024px)
- Horizontal navbar with hamburger menu toggle
- Mobile menu open/close functionality
- Touch-friendly navigation buttons and spacing
- Responsive header layout and sizing
- Responsive page content and containers
- Responsive table layouts in admin pages
- Responsive modal dialogs
- Responsive form layouts
- Flexible grid and flexbox implementations
- Media query implementation for breakpoints
- Mobile-first design approach
- Touch event handling for mobile
- Accessible navigation patterns

### Out of Scope (Excluded)

- Native mobile app development
- PWA (Progressive Web App) features
- Offline functionality
- Touch gesture controls (swipe, pinch, etc.)
- Device-specific optimizations (iPad tablet layout)
- Responsive image loading/optimization
- Viewport scaling configuration
- Mobile browser compatibility testing
- Performance optimization for mobile networks
- Mobile-specific features (geolocation, camera, etc.)

---

## Sub-Requirements (Feature Breakdown)

**Responsive Breakpoints:**
- Desktop breakpoint: width >= 1024px (vertical navbar, full layout)
- Tablet breakpoint: 768px <= width < 1024px (transitional layout)
- Mobile breakpoint: width < 768px (horizontal navbar, mobile layout)
- Configurable breakpoint values (can be adjusted based on design needs)
- Smooth transitions between breakpoints

**Vertical Navbar (Desktop >= 1024px):**
- Navbar positioned on left side of screen
- Navbar width: typically 200-250px
- Navbar remains visible and fixed or sticky
- Links displayed vertically (one per row)
- Full link text visible without truncation
- Active link highlighted
- Logo/branding visible in navbar
- Responsive to navbar height changes
- Does not collapse or hide on desktop

**Horizontal Navbar (Mobile < 768px):**
- Navbar positioned above or below main content
- Navbar displayed as horizontal bar
- Hamburger menu icon present and clickable
- Hamburger icon only displays on mobile
- Mobile menu items hidden by default
- Mobile menu toggles open/close on icon click
- Full-width or near full-width on small screens
- Menu items displayed vertically in mobile menu overlay/drawer
- Menu can overlay content or push content down
- Touch-friendly button sizes (min 44px height recommended)
- Menu items have adequate spacing for touch
- Close button or back button in mobile menu
- Menu closes when link is clicked

**Hamburger Menu Implementation:**
- Hamburger icon (three horizontal lines) visible on mobile
- Icon clickable/tappable with adequate touch area
- Icon animated (optional: morphs to X when open)
- Clicking icon toggles menu open/close
- Menu appears as overlay or drawer
- Menu overlay semi-transparent background (optional)
- Menu has z-index above other content
- Menu closes when clicking outside (on overlay)
- Menu closes when clicking a link
- Menu state persists during page navigation (or resets)

**Responsive Content Areas:**
- Main content area adjusts width based on navbar visibility
- Flexbox or grid layouts adapt to screen size
- Tables in admin pages respond to smaller screens:
  - On small screens: horizontal scroll, stacked layout, or condensed view
  - Columns may hide or reorder based on priority
  - Actions column visible at top or right
- Modals/dialogs resize to fit mobile screens
- Form fields stack vertically on mobile
- Form full-width on mobile, constrained width on desktop

**Header Responsiveness:**
- Header remains visible on all screen sizes
- Header logo/branding responsive sizing
- Header buttons/icons responsive sizes
- Header search box (if present) responsive
- Header user menu accessible on mobile
- Header layout adjusts spacing for mobile

**Padding & Spacing:**
- Base padding adjusted for screen size
- Larger padding/margins on desktop
- Reduced padding/margins on mobile to save space
- Consistent spacing ratios across breakpoints
- Touch targets minimum 44x44px on mobile

**Font & Text Sizing:**
- Font sizes scale appropriately for readability
- Larger fonts on desktop (16px-18px body text)
- Readable fonts on mobile (16px minimum for body text)
- Heading sizes adapt to screen size
- Line height adequate for readability on all sizes

**Navigation Link Visibility:**
- Logo/brand link always visible
- Primary navigation links visible on desktop
- Primary navigation links in mobile menu on mobile
- Active page highlighted on all screen sizes
- Admin link visible only for admin users (regardless of screen size)

---

## User Flow / Logic (High Level)

1. **User on Desktop (width >= 1024px):**
   - Page loads with vertical sidebar navbar on left
   - User sees full navigation links vertically
   - User clicks links to navigate
   - Content area takes up remaining width
   - No hamburger menu visible

2. **User Resizes Browser to Tablet (768px - 1024px):**
   - Navbar begins to compact
   - Layout adjusts to tablet size
   - Navigation may adjust spacing
   - User can still see primary navigation

3. **User Resizes to Mobile (width < 768px):**
   - Vertical navbar collapses/hides
   - Horizontal navbar appears at top
   - Hamburger menu icon (☰) appears in navbar
   - Navigation links hidden in mobile menu
   - User sees main content taking full width

4. **User Clicks Hamburger Menu on Mobile:**
   - Hamburger icon is tapped
   - Mobile menu drawer/overlay slides in or appears
   - Menu displays all navigation links vertically
   - Semi-transparent overlay covers content (optional)
   - Menu items are tab-friendly and touch-friendly

5. **User Navigates in Mobile Menu:**
   - User taps "Home" link in mobile menu
   - Menu closes automatically
   - Page navigates to Home
   - Content updates
   - Mobile menu remains hidden until icon tapped again

6. **User Clicks Outside Mobile Menu:**
   - User taps outside the menu overlay
   - Menu closes (if overlay implementation)
   - Content becomes interactive again

7. **User in Admin Section on Mobile:**
   - Admin page displays responsive table
   - If table too wide for mobile, horizontal scroll enabled
   - Or columns reorder/hide based on importance
   - Delete/Edit buttons remain accessible
   - Pagination controls are touch-friendly

8. **User Opens Modal on Mobile:**
   - Modal displays full width or near full width
   - Modal height adjusts to content
   - Close button visible and accessible
   - Form fields stack vertically
   - Save/Cancel buttons full-width or side-by-side based on space

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- Navbar.jsx — Updated navbar component with responsive logic
- HamburgerMenu.jsx — Hamburger menu toggle component
- MobileMenu.jsx (or NavDrawer.jsx) — Mobile menu drawer/overlay
- Layout.jsx — Main layout adapting to navbar state
- ResponsiveTable.jsx — Table with responsive behavior
- ResponsiveModal.jsx — Modal with responsive sizing
- ResponsiveForm.jsx — Form with responsive layout

**Desktop Layout (width >= 1024px):**
```
┌─────────────────────────────────────────┐
│         HEADER                          │
├─────────┬───────────────────────────────┤
│         │                               │
│ NAVBAR  │                               │
│ (Left)  │    MAIN CONTENT               │
│ Vertical│                               │
│         │                               │
│         │                               │
└─────────┴───────────────────────────────┘
```

**Mobile Layout (width < 768px):**
```
┌──────────────────────────┐
│ ☰  HEADER                │
├──────────────────────────┤
│                          │
│   MAIN CONTENT           │
│                          │
│                          │
└──────────────────────────┘

Mobile Menu (Open):
┌──────────────────────────┐
│ ☰  [X]                   │
├──────────────────────────┤
│ Home                     │
│ Bloggs                   │
│ Network                  │
│ Admin (if admin user)    │
│ Logout                   │
└──────────────────────────┘
```

**Tablet/Transitional (768px - 1024px):**
```
┌──────────────────────────────────┐
│         HEADER                   │
├──────┬──────────────────────────┤
│      │                          │
│ NAV  │   MAIN CONTENT           │
│(Compact)│                         │
│      │                          │
└──────┴──────────────────────────┘
```

### Backend / API

No new endpoints required. Responsive Design is purely frontend implementation using CSS media queries and JavaScript event handling. Existing endpoints used:
- All existing frontend routes and API calls
- No backend changes needed

---

## Data Used or Modified

**Frontend State:**
- `isMobileMenuOpen` (boolean, tracks mobile menu open/close state)
- `screenWidth` (number, current window width in pixels)
- `isDesktop` (boolean, true if width >= desktop breakpoint)
- `isTablet` (boolean, true if width is in tablet range)
- `isMobile` (boolean, true if width < mobile breakpoint)
- `breakpoints` (object with configured breakpoint values)

**No Data Modified** — Responsive Design affects only UI presentation, no actual data changes.

**Breakpoint Configuration (constants):**
```javascript
const breakpoints = {
  mobile: 768,    // width < 768px = mobile
  tablet: 1024,   // width >= 768px and < 1024px = tablet
  desktop: 1024   // width >= 1024px = desktop
};
```

---

## Tech Constraints (Feature-Level)

- Use CSS media queries with defined breakpoints
- Use React state for mobile menu toggle
- Implement with `useMediaQuery()` hook or `window.matchMedia()`
- Track window resize events with `useEffect()` and `addEventListener`
- Implement responsive CSS using flexbox or grid
- Mobile-first approach: base styles for mobile, add desktop enhancements
- Hamburger menu animated with CSS transitions
- Menu drawer uses CSS or library (e.g., React Drawer)
- Touch-friendly button sizes: minimum 44x44px
- No hardcoded pixel widths for layout sections
- Use percentage or relative widths for responsiveness
- Implement debouncing for window resize handler
- Close mobile menu on route navigation
- Preserve mobile menu state during content updates (or reset it)
- Implement responsive table with horizontal scroll on mobile
- Form fields should stack vertically on mobile (100% width)
- Modal width responsive: 100% on mobile, constrained on desktop
- All colors and styling match Color Palette
- Text remains readable at all breakpoints
- Maintain dark mode compatibility if applicable
- Test across multiple device sizes and orientations
- Avoid fixed positions that interfere with responsive layout

---

## Acceptance Criteria

- [ ] Navbar displays vertically on desktop (width >= 1024px)
- [ ] Navbar displays horizontally on mobile (width < 768px)
- [ ] Navbar transitions smoothly between vertical and horizontal layouts
- [ ] Hamburger menu icon displays only on mobile screens (< 768px)
- [ ] Hamburger menu icon is clickable and tappable (touch-friendly)
- [ ] Clicking hamburger menu opens mobile menu drawer/overlay
- [ ] Mobile menu displays navigation links vertically
- [ ] Mobile menu displays all navigation options
- [ ] Mobile menu displays Admin link only for admin users
- [ ] Mobile menu closes when user clicks a navigation link
- [ ] Mobile menu closes when user clicks outside the menu (overlay)
- [ ] Mobile menu has close button (X) or back button
- [ ] Mobile menu overlay has semi-transparent background (if overlay style)
- [ ] Mobile menu items have adequate touch-friendly spacing (min 44px height)
- [ ] Mobile menu items are easily tappable
- [ ] Header remains visible and functional on all screen sizes
- [ ] Header logo/branding responsive sizing
- [ ] Header buttons/icons responsive and accessible on mobile
- [ ] Main content area adjusts width based on navbar visibility
- [ ] Main content takes full width on mobile (when navbar hidden)
- [ ] Main content takes appropriate width on desktop (with vertical navbar)
- [ ] Tables in admin pages remain usable on mobile (scroll or reflow)
- [ ] Admin table columns reorder or hide based on relevance on mobile
- [ ] Admin table Actions column remains accessible on mobile
- [ ] Modals/dialogs resize appropriately for mobile screens
- [ ] Modal width is full or near full-width on mobile (< 768px)
- [ ] Modal width is constrained on desktop (>= 768px)
- [ ] Form fields stack vertically on mobile
- [ ] Form fields display side-by-side on desktop (if layout permits)
- [ ] Form buttons are full-width or appropriately sized on mobile
- [ ] Padding and margins adjust appropriately for each breakpoint
- [ ] Font sizes remain readable at all breakpoints
- [ ] Font sizes are adequate for mobile (minimum 16px for body text)
- [ ] Line height is adequate for readability on all sizes
- [ ] All links have adequate touch target size (min 44x44px)
- [ ] All buttons have adequate touch target size (min 44x44px)
- [ ] Hamburger menu icon has adequate size and touch area
- [ ] Content does not overflow or create unwanted horizontal scroll
- [ ] Vertical scroll is smooth and functional
- [ ] No content is cut off or hidden inappropriately
- [ ] Responsive design works on landscape orientation (mobile device rotated)
- [ ] Responsive design works on portrait orientation (mobile device normal)
- [ ] Desktop design remains unchanged and functional
- [ ] Tablet design (768-1024px) adapts appropriately
- [ ] Mobile design (< 768px) is optimized for small screens
- [ ] Navbar collapse/expansion animation is smooth
- [ ] Mobile menu open/close animation is smooth
- [ ] No layout shift or jumping when toggling navbar
- [ ] All text colors meet contrast requirements on all screen sizes
- [ ] All styling matches Color Palette
- [ ] Responsive CSS uses media queries (not JavaScript-driven sizing)
- [ ] Performance is not negatively impacted by responsive implementation
- [ ] Window resize handler debounced or optimized
- [ ] Mobile menu state managed correctly during navigation
- [ ] No console errors or warnings related to responsive behavior
- [ ] Responsive design tested on multiple real devices or emulators
- [ ] Tested breakpoints: 320px, 480px, 768px, 1024px, 1440px

---

## Notes for the AI

- **Breakpoint Selection:**
  - Recommended breakpoints: 768px (mobile/tablet boundary), 1024px (tablet/desktop boundary)
  - Can be adjusted based on design requirements and content
  - Consider your target audience and common device sizes

- **Mobile-First CSS Approach:**
  ```css
  /* Base styles for mobile */
  .navbar {
    position: fixed;
    top: 0;
    width: 100%;
    ... horizontal styles ...
  }
  
  /* Desktop styles */
  @media (min-width: 1024px) {
    .navbar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 250px;
      ... vertical styles ...
    }
  }
  ```

- **Responsive State Hook:**
  ```jsx
  const useResponsive = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    
    useEffect(() => {
      const debounce = setTimeout(() => {
        setScreenWidth(window.innerWidth);
      }, 100);
      
      const handleResize = () => clearTimeout(debounce) || debounce;
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return {
      isMobile: screenWidth < 768,
      isTablet: screenWidth >= 768 && screenWidth < 1024,
      isDesktop: screenWidth >= 1024
    };
  };
  ```

- **Hamburger Menu Toggle:**
  ```jsx
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  ```

- **Mobile Menu Implementation Options:**
  1. **Overlay Drawer:** Menu slides in from left/top, semi-transparent overlay behind
  2. **Push Content:** Menu pushes main content to the side
  3. **Bottom Sheet:** Menu slides up from bottom (less common for navigation)
  - Overlay drawer recommended for admin navigation

- **Responsive Table Strategies:**
  1. **Horizontal Scroll:** Allow table to scroll horizontally on mobile
  2. **Column Hiding:** Hide less important columns on mobile
  3. **Stacked Layout:** Display table rows as stacked cards on mobile
  4. **Reflow:** Reorganize columns based on available width
  - Use the simplest approach that maintains usability

- **Touch-Friendly Spacing:**
  ```css
  /* Minimum touch target size */
  button, a, input {
    min-height: 44px;
    min-width: 44px;
    padding: 12px;
  }
  ```

- **Close Mobile Menu on Route Change:**
  ```jsx
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]); // closes menu when route changes
  ```

- **Modal Responsiveness:**
  ```css
  @media (max-width: 768px) {
    .modal {
      width: 95%;
      height: auto;
      max-height: 90vh;
      margin: auto;
    }
  }
  ```

- **Form Responsiveness:**
  ```css
  .form-group {
    display: flex;
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    .form-group {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  ```

- **Header Responsive:**
  ```css
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }
  
  .header-logo {
    font-size: 1.5rem;
  }
  
  @media (max-width: 768px) {
    .header-logo {
      font-size: 1.2rem;
    }
  }
  ```

- **Related Features:**
  - This feature affects all pages: Home, Bloggs, Network, Admin
  - Works alongside User Manager ([🤖 AI_FEATURE_User Manager.md](./🤖%20AI_FEATURE_User%20Manager.md))
  - Works alongside Content Manager ([🤖 AI_FEATURE_Content Manager.md](./🤖%20AI_FEATURE_Content%20Manager.md))
  - Complements Reactive Design ([🤖 AI_FEATURE_Reactive Design.md](./🤖%20AI_FEATURE_Reactive%20Design.md))

---

## Integration Notes

The Responsive Design feature is foundational to the entire application and should be implemented early in development. All pages (Home, Bloggs, Network, Admin, Login, Register) should follow the responsive design patterns outlined in this specification.

The primary requirement is the navbar transformation: vertical on desktop, horizontal on mobile. All other responsive elements should follow similar media query patterns and mobile-first principles.

This feature works in conjunction with the Reactive Design feature - skeleton loaders and loading states should also be responsive to screen size. Consider performance implications on smaller devices and optimize animations and transitions accordingly.

Mobile responsiveness testing should be done across multiple actual devices or high-fidelity emulators to ensure touch interactions, gesture handling, and visual appearance are optimal.
