🤖 AI_FEATURE_Reactive Design

---

## Feature Identity

- **Feature Name:** Reactive Design
- **Related Area:** Admin / UX/UI

---

## Feature Goal

Provide seamless, responsive user experience across all admin pages by implementing skeleton loaders during data loading and update operations. The Reactive Design feature ensures users receive immediate visual feedback that data is being fetched or processed, reducing perceived wait times and improving overall application responsiveness.

---

## Feature Scope

### In Scope (Included)

- Skeleton loaders in User Manager table during initial load
- Skeleton loaders in User Manager table during data updates/refresh
- Skeleton loaders in User Manager during pagination changes
- Skeleton loaders in User Manager during search/filter operations
- Skeleton loaders in Content Manager table during initial load
- Skeleton loaders in Content Manager table during data updates/refresh
- Skeleton loaders in Content Manager during pagination changes
- Skeleton loaders in Content Manager during date range filter operations
- Professional, animated skeleton UI components
- Smooth transitions between skeleton and loaded content
- Loading indicators for modal operations
- Loading states for form submissions
- Loading states for delete operations (pre-confirmation)
- Consistent skeleton styling across admin pages
- Color Palette compliance for skeleton designs
- Responsive skeleton layouts

### Out of Scope (Excluded)

- Skeleton loaders on non-admin pages
- Custom animation effects beyond standard skeleton loaders
- Shimmer effects or complex animations
- Progressive image loading
- Real-time data streaming or live updates
- Skeleton loaders for modal forms
- Backend optimization for faster loading
- Caching strategies or data persistence
- Prefetching or preloading of data

---

## Sub-Requirements (Feature Breakdown)

**User Manager Skeleton Loaders:**
- Skeleton loader displays when page initially loads
- Skeleton loader mimics table structure with placeholder rows
- Skeleton shows 5-10 placeholder rows matching table layout
- Each placeholder row includes skeleton blocks for: First Name, Last Name, Email, Occupation, Location, Birthdate, Auth Level, Actions
- Skeleton loaders appear during pagination navigation (when loading new page)
- Skeleton loaders appear during search/filter operations (as filters are typed)
- Skeleton loaders appear when changing Results-Per-Page dropdown
- Skeleton loaders appear when Clearing filters (reloading full list)
- Skeleton fades smoothly when actual data loads
- No abrupt transition or flashing between skeleton and content

**Content Manager Skeleton Loaders:**
- Skeleton loader displays when page initially loads
- Skeleton loader mimics table structure with placeholder rows
- Skeleton shows 5-10 placeholder rows matching table layout
- Each placeholder row includes skeleton blocks for: Content (preview), Author Name, Date Created, Actions
- Skeleton loaders appear during pagination navigation (when loading new page)
- Skeleton loaders appear during date range filter operations (as dates are typed)
- Skeleton loaders appear when changing Results-Per-Page dropdown
- Skeleton loaders appear when clicking Select All button (reloading full list)
- Skeleton fades smoothly when actual data loads
- No abrupt transition or flashing between skeleton and content

**Skeleton Design:**
- Skeleton blocks are light gray background (using Color Palette)
- Skeleton blocks have subtle shimmer or pulse animation (optional)
- Skeleton blocks match dimensions of actual content (similar heights/widths)
- Skeleton layout mirrors actual table/content layout exactly
- Multiple rows of skeleton appear (5-10 rows recommended)
- Animation is smooth and not distracting
- Animation repeats continuously until data loads

**Modal & Form Loading States:**
- Delete confirmation modals show loading state while processing deletion
- Edit form (User Update) shows loading state while submitting changes
- Form buttons disabled during submission to prevent multi-submit
- Loading indicator or spinner displayed next to button during submission
- Confirmation modal shows loading state while processing
- Loading message displays (e.g., "Deleting..." or "Saving...")

**Transitions & Performance:**
- Skeleton fades out or transitions smoothly as real content fades in
- No flickering or jarring transitions
- Transitions complete within 200-500ms
- Page remains usable (skeleton is not interactive)
- Skeleton loading appears immediately when action triggers
- Loading states persist until data is fully received

---

## User Flow / Logic (High Level)

1. **User Manager Page Load:**
   - Admin navigates to User Manager
   - Page requests user data from backend
   - Skeleton loader displays immediately
   - 5-10 placeholder rows appear with shimmer animation
   - Data fetches and loads
   - Skeleton fades out smoothly
   - Real user table content displays

2. **User Manager Pagination:**
   - Admin on page 1 of User Manager
   - Admin clicks "Next" or page number button
   - Skeleton loader displays for new page
   - Placeholder rows appear with animation
   - New page data fetches
   - Skeleton fades out
   - Page 2 content displays

3. **User Manager Search Filtering:**
   - Admin types in First Name field
   - As user types, skeleton loader appears
   - Placeholder rows visible with animation
   - Backend filters and returns filtered results
   - Skeleton fades and filtered table displays
   - Process repeats as admin continues typing

4. **User Manager Clear Filters:**
   - Admin clicks Clear button
   - Skeleton loader displays
   - Fresh data fetches (all users)
   - Skeleton fades
   - Full user list displays

5. **Content Manager Page Load:**
   - Admin navigates to Content Manager
   - Page requests post data from backend
   - Skeleton loader displays immediately
   - 5-10 placeholder rows appear with animation
   - Data fetches and loads
   - Skeleton fades out smoothly
   - Real post table content displays

6. **Content Manager Date Filter:**
   - Admin types in Date Start field
   - As user types, skeleton loader appears
   - Placeholder rows visible
   - Backend filters posts by date
   - Skeleton fades
   - Filtered post table displays

7. **Delete Operation:**
   - Admin clicks Delete button
   - Confirmation modal appears (no skeleton needed here)
   - Admin clicks "Delete" in modal
   - Modal shows loading state
   - "Deleting..." message or spinner displays
   - Backend processes deletion
   - Success message displays
   - User removed from table

8. **User Update Form Submission:**
   - Admin completes form edits on User Update page
   - Admin clicks Save button
   - Confirmation modal appears
   - Admin clicks "Confirm" in modal
   - Modal or button shows loading state
   - "Saving..." message or spinner displays
   - Backend processes update
   - Success message displays
   - Redirects back to User Manager

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- SkeletonLoader.jsx — Reusable skeleton loader component
- SkeletonTableRow.jsx — Skeleton placeholder for table rows
- SkeletonText.jsx — Skeleton placeholder for text blocks
- SkeletonButton.jsx — Skeleton placeholder for buttons
- LoadingSpinner.jsx — Spinner for form/modal loading states
- UserManagerSkeleton.jsx — User Manager specific skeleton layout
- ContentManagerSkeleton.jsx — Content Manager specific skeleton layout

**Skeleton Loader Example:**
```
┌──────────────────────────────────────────────┐
│ SKELETON LOADING STATE:                      │
│ ┌──────────────────────────────────────────┐ │
│ │ ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓│ │
│ ├──────────────────────────────────────────┤ │
│ │ ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓│ │
│ │ ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓│ │
│ │ ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓│ │
│ │ ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓│ │
│ │ ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓│ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ (Transitions to real content when loaded)   │
│                                              │
└──────────────────────────────────────────────┘
```

**Modal Loading State Example:**
```
┌──────────────────────────────────────┐
│ Delete User?                         │
├──────────────────────────────────────┤
│ Are you sure you want to delete      │
│ John Doe?                            │
│                                      │
│ This action cannot be undone.        │
├──────────────────────────────────────┤
│ [Deleting...  ⌛] [Cancel]           │
│                                      │
│ (Button disabled, spinner displays)  │
└──────────────────────────────────────┘
```

### Backend / API

No new endpoints required. Skeleton loaders are purely frontend visualization during existing data fetches via:
- `GET /users` (User Manager data)
- `GET /posts` (Content Manager data)
- `PUT /user/:id` (User Update submission)
- `DELETE /posts/:postId` (Post deletion)

---

## Data Used or Modified

**No Data Modified** — Skeleton loaders are visual UI elements only, no data is stored or modified.

**Visual State Data:**
- `isLoading` (boolean, true while data is fetching)
- `loadingSource` (string, indicates which operation triggered loading: 'initial', 'pagination', 'filter', 'delete', 'save')
- `skeletonRows` (number, typically 5-10, shows how many placeholder rows to display)

**Timing Data:**
- Skeleton displays immediately when action triggers (0ms delay)
- Skeleton persists until data received from backend
- Fade/transition duration: 200-500ms
- Animation frame rate: 60fps (smooth)

---

## Tech Constraints (Feature-Level)

- Use React components for skeleton implementations
- Use `useState()` to manage loading state: `const [isLoading, setIsLoading] = useState(true);`
- Set `isLoading = true` before fetch, `setIsLoading = false` after response
- Implement with CSS animations (pulse or shimmer effect)
- Use Light Gray color from Color Palette for skeleton backgrounds
- Skeleton blocks should match actual content dimensions closely
- Implement smooth fade transitions (CSS opacity transitions)
- No JavaScript-heavy animations, keep performance optimized
- Skeleton should not block user interaction with page
- Skeleton height/width should mirror table cell dimensions exactly
- Multiple skeleton rows (5-10) to show pagination extent
- Skeleton animation should loop continuously until replaced
- Apply skeleton loaders to all table data loads in admin pages
- Apply loading states to all button/form submissions
- Disable buttons during submission to prevent multiple requests
- Show loading message or spinner during form submission
- Modal buttons disabled during processing
- Use consistent loading indicators across all pages

---

## Acceptance Criteria

- [ ] Skeleton loader displays on User Manager initial page load
- [ ] Skeleton loader shows 5-10 placeholder rows
- [ ] Skeleton rows mimic table structure (columns for Name, Email, etc.)
- [ ] Skeleton loader fades out smoothly when data loads
- [ ] No flickering or jarring transitions occur
- [ ] Skeleton loader displays when paginating User Manager
- [ ] Skeleton loader displays when filtering User Manager with search
- [ ] Skeleton loader displays when changing Results-Per-Page dropdown
- [ ] Skeleton loader displays when clearing filters
- [ ] Skeleton loader displays on Content Manager initial page load
- [ ] Skeleton loader shows 5-10 placeholder rows in Content Manager
- [ ] Skeleton rows mimic post table structure (Content, Author, Date)
- [ ] Skeleton loader fades out smoothly when post data loads
- [ ] Skeleton loader displays when paginating Content Manager
- [ ] Skeleton loader displays when filtering Content Manager by date
- [ ] Skeleton loader displays when changing Results-Per-Page in Content Manager
- [ ] Skeleton loader displays when clicking Select All in Content Manager
- [ ] Skeleton animation is subtle and not distracting
- [ ] Skeleton animation repeats smoothly during loading
- [ ] Skeleton uses Light Gray or appropriate palette color
- [ ] Skeleton layout exactly matches actual table layout
- [ ] Delete confirmation modal shows loading state during deletion
- [ ] Delete button displays "Deleting..." or spinner during processing
- [ ] Delete button is disabled during deletion to prevent multi-submit
- [ ] User Update form shows loading state during submission
- [ ] User Update button displays "Saving..." or spinner during processing
- [ ] User Update button is disabled during submission
- [ ] Confirmation modal shows loading state during form submission
- [ ] Loading message is clear and user-friendly
- [ ] Skeleton displays immediately when action triggers (no delay)
- [ ] Skeleton persists until data fully received
- [ ] Transitions complete smoothly within 200-500ms
- [ ] No console errors or warnings related to loading states
- [ ] Skeleton loaders use performant CSS animations
- [ ] Page remains responsive during skeleton display
- [ ] Skeleton appears on all table data fetch operations
- [ ] Skeleton appears consistent across User Manager and Content Manager
- [ ] Loading spinners consistent across all modals and forms
- [ ] All skeleton/loading UI matches design system styling
- [ ] All text using appropriate Color Palette colors

---

## Notes for the AI

- **Skeleton Component Structure:**
  ```jsx
  const UserManagerSkeleton = ({ rows = 5 }) => (
    <table>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonTableRow key={i} />
        ))}
      </tbody>
    </table>
  );
  ```

- **Loading State Management:**
  ```jsx
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    fetchUsers()
      .then(data => setUsers(data))
      .finally(() => setIsLoading(false));
  }, []);
  ```

- **CSS Shimmer Animation:**
  ```css
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  .skeleton {
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
  ```

- **Smooth Transitions:**
  ```css
  .skeleton-wrapper {
    transition: opacity 0.3s ease-out;
  }
  
  .skeleton-wrapper.loading {
    opacity: 1;
  }
  
  .skeleton-wrapper.loaded {
    opacity: 0;
  }
  ```

- **User Manager Skeleton:**
  - Match table columns: First, Last, Email, Occupation, Location, Birthdate, Auth Level, Actions
  - Each skeleton cell height should match content cell height
  - Use 5-10 placeholder rows by default

- **Content Manager Skeleton:**
  - Match table columns: Content (wider), Author, Date, Actions
  - Content column shows longer skeleton block
  - Use 5-10 placeholder rows by default

- **Pagination Skeleton:**
  - Reset skeleton to top of table when navigating pages
  - All rows should be skeleton, not just appended rows
  - Maintain scroll position if possible, or scroll to top

- **Form/Modal Submission:**
  - Disable submit button during request
  - Show spinner or "..." next to button
  - Message examples: "Saving...", "Deleting...", "Loading..."
  - Re-enable button only on success or error

- **Performance Optimization:**
  - Use CSS animations, not JavaScript animations
  - Keep shimmer/pulse animation subtle
  - No heavy computation during skeleton display
  - Skeleton should not impact page performance

- **Error States:**
  - If fetch fails, hide skeleton and show error message
  - Provide retry option in error message
  - Error display should be clear and actionable

- **Color Consideration:**
  - Use Light Gray (#F5F5F5 or similar from palette)
  - Use slightly darker gray for shimmer effect
  - Ensure sufficient contrast with background

- **Related Features:**
  - Apply to User Manager ([🤖 AI_FEATURE_User Manager.md](./🤖%20AI_FEATURE_User%20Manager.md))
  - Apply to Content Manager ([🤖 AI_FEATURE_Content Manager.md](./🤖%20AI_FEATURE_Content%20Manager.md))
  - Apply to User Update ([🤖 AI_FEATURE_User Update.md](./🤖%20AI_FEATURE_User%20Update.md))

---

## Integration Notes

The Reactive Design feature enhances the user experience across all admin pages by providing visual feedback during loading operations. Skeleton loaders should be implemented in conjunction with the User Manager, Content Manager, and User Update features to provide seamless, responsive interactions. This feature does not modify data or backend logic—it purely enhances the frontend presentation during data fetching and processing.

All skeleton loaders should follow the same design language and animation patterns for consistency across the application. The implementation respects the Color Palette and maintains responsive design principles.
