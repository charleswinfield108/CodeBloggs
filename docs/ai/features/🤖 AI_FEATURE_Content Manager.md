🤖 AI_FEATURE_Content Manager

---

## Feature Identity

- **Feature Name:** Content Manager
- **Related Area:** Admin / Pages

---

## Feature Goal

Provide administrators with a comprehensive content moderation interface to view, search, filter, and delete posts from users. The Content Manager enables admins to maintain content quality, remove inappropriate or policy-violating posts, and manage the platform's content library with filtering by date range, pagination, and bulk operations support.

---

## Feature Scope

### In Scope (Included)

- Content Manager page accessible only to admin users (auth_level = 'admin')
- Table displaying all posts with key information
- Date Start input field for filtering by post creation date range
- Date End input field for filtering by post creation date range
- Real-time search/filtering functionality (auto-filtering as user types)
- Date range filtering (start date, end date, or both)
- Select All button to retrieve all posts regardless of filters
- Delete button for each post row
- Delete confirmation modal before post removal
- Pagination control to navigate through multiple pages of posts
- Results-per-page dropdown selector (configurable page size)
- Visual feedback for search results
- Loading states for data fetching
- Error handling and display
- Professional styling using Color Palette
- Responsive layout for admin desktop use

### Out of Scope (Excluded)

- Post editing or modification functionality
- Bulk post operations (select multiple, bulk delete at once)
- Post approval or moderation queue
- Content flagging or reporting system
- Moderation logs or audit trails
- Post restoration or recovery
- User suspension or banning
- Automated content filtering or AI detection
- Post metadata modification (dates, author, etc.)
- Archive or soft-delete functionality
- Real-time post updates

---

## Sub-Requirements (Feature Breakdown)

**Date Range Filter:**
- Date Start input field for filtering posts by start date
- Date End input field for filtering posts by end date
- Date format: MM/DD/YYYY or consistent format
- Filtering triggers automatically as user types (no submit button needed)
- Results update in real-time as user types dates
- Filter by start date only: shows posts on or after that date
- Filter by end date only: shows posts on or before that date
- Filter by both: shows posts within the date range (inclusive)
- Empty date fields clear corresponding filters
- Date validation: end date cannot be before start date (optional client-side validation)

**Select All Button:**
- Select All button present and visible on page
- Clicking Select All clears all date filters
- Clicking Select All retrieves all posts from backend
- Button is visually distinct and accessible
- Table displays all posts after Select All is clicked
- Resets pagination to page 1

**Post Table Display:**
- Table displays all posts (or filtered results)
- Table includes columns: Post Content (preview/excerpt), Author Name, Date Created, Actions
- Optional additional columns: Post ID, Author ID, Comment Count, Like Count
- Table columns are properly aligned and readable
- Each row represents one post
- No duplicate entries in table
- Post content displays as preview/excerpt (first 100-200 characters)
- Full content available on hover or in separate view

**Delete Functionality:**
- Delete button present in Actions column for each post
- Clicking Delete triggers confirmation modal
- Confirmation modal displays post preview and author name
- Confirmation modal displays warning message
- Confirmation modal has "Delete" and "Cancel" buttons
- Clicking "Delete" in modal removes post from system
- Clicking "Cancel" closes modal without deleting
- Delete request sent to DELETE /posts/:postId endpoint
- Post removed from table after successful deletion
- Success message displays after successful deletion
- Error message displays if deletion fails
- Comments associated with deleted post should also be deleted (backend logic)

**Pagination:**
- Table data is paginated (not all posts on one page)
- Pagination controls display at bottom or top of table
- Pagination shows current page number and total pages
- Pagination buttons: Previous, page numbers, Next
- Clicking page number navigates to that page
- Previous button disabled on first page
- Next button disabled on last page
- Page updates table display without full page reload

**Results-Per-Page Dropdown:**
- Dropdown located near pagination or top-right of table
- Dropdown options: 5, 10, 15, 25, 50 (or similar)
- Default selection: 10 posts per page
- Changing dropdown value reloads table with new page size
- Returns to page 1 when page size changes
- Selected value persists in dropdown UI

---

## User Flow / Logic (High Level)

1. **Admin Navigates to Content Manager:**
   - Admin user logs in
   - Admin clicks Content Manager card or link from Admin Dashboard
   - Navigate to /admin/content or /admin/posts route
   - Page loads and displays all posts in table

2. **Filter Posts by Date Range:**
   - Admin enters date in Date Start field (e.g., "03/01/2026")
   - Table filters in real-time showing posts on or after that date
   - Admin enters date in Date End field (e.g., "03/15/2026")
   - Table filters showing posts within the date range
   - Admin can modify dates to adjust filter results
   - Results update as admin types

3. **Select All Posts:**
   - Admin clicks Select All button
   - All date filters are cleared
   - Full post list loads from backend
   - Table displays all posts, pagination resets to page 1

4. **Browse Paginated Results:**
   - Table displays 10 posts per page by default
   - Admin clicks "Next" button to view more posts
   - Page 2 posts display in table
   - Admin clicks "Previous" to return to page 1

5. **Change Results Per Page:**
   - Admin clicks Results-Per-Page dropdown
   - Selects "25" from dropdown options
   - Table reloads showing 25 posts per page
   - Pagination recalculates and updates

6. **Delete a Post:**
   - Admin clicks Delete button on a post row
   - Confirmation modal appears
   - Modal displays post preview and author name
   - Modal displays warning: "This action cannot be undone"
   - Admin clicks "Delete" button in modal
   - Backend removes post and associated comments
   - Confirmation modal closes
   - Post removed from table
   - Success message displays

7. **Handle Errors:**
   - If date range is invalid: show error message
   - If end date before start date: show error message
   - If filter returns no results: display "No posts found" message
   - If fetch fails: display error message and retry option
   - If delete fails: display error message with details

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- ContentManager.jsx — Main content manager page component
- PostTable.jsx — Table component displaying posts
- PostTableRow.jsx — Individual post row component
- DeleteConfirmationModal.jsx — Modal for delete confirmation
- DateRangeFilter.jsx — Date range input filter component
- Pagination.jsx — Pagination control component

**Page Layout:**
```
┌──────────────────────────────────────────────┐
│           HEADER                             │
├────────┬──────────────────────────────────────┤
│  ADMIN │  CONTENT MANAGER                     │
│  NAV   ├──────────────────────────────────────┤
│        │ DATE FILTERS:                        │
│        │ [Date Start] [Date End] [Select All] │
│        ├──────────────────────────────────────┤
│        │ Results Per Page: [Dropdown ▼]       │
│        │                                      │
│        │ ┌──────────────────────────────────┐ │
│        │ │ Content │ Author │ Date│ Actions│ │
│        │ ├──────────────────────────────────┤ │
│        │ │ Great... │ John   │3/16 │[🗑]   │ │
│        │ │ Just... │ Jane   │3/15 │[🗑]   │ │
│        │ │ This... │ Bob    │3/14 │[🗑]   │ │
│        │ └──────────────────────────────────┘ │
│        │ Pagination: [< 1 2 3 >]              │
│        │                                      │
│        └──────────────────────────────────────┘
```

**Delete Confirmation Modal Layout:**
```
┌──────────────────────────────────────┐
│ Delete Post?                         │
├──────────────────────────────────────┤
│ Author: John Doe                     │
│ Date: Mar 16, 2026                   │
│                                      │
│ "Great post about React hooks and..." │
│                                      │
│ Are you sure you want to delete      │
│ this post?                           │
│ This action cannot be undone.        │
├──────────────────────────────────────┤
│ [Delete]  [Cancel]                   │
└──────────────────────────────────────┘
```

### Backend / API

- `GET /posts` — Fetch all posts with optional filtering
  - Input: Query parameters (optional): `page`, `limit`, `startDate`, `endDate`
  - Output: `{ posts: [ { _id, content, author_id, author_name, createdAt, likes_count, comments_count }, ... ], total: count, pages: number }`
  - Status: 200 success, 500 server error

- `DELETE /posts/:postId` — Delete a post
  - Input: `postId` (post ID from URL parameter)
  - Output: `{ message: "Post deleted successfully" }` or `{ success: true }`
  - Status: 200 success, 404 post not found, 500 server error
  - Side effect: Delete associated comments when post is deleted

- `GET /posts/:postId` — Fetch single post (optional, for modal preview)
  - Input: `postId` (post ID)
  - Output: `{ _id, content, author_id, author_name, createdAt, likes_count, comments_count }`
  - Status: 200 success, 404 post not found

---

## Data Used or Modified

**Input Data (from session):**
- `user_id` (ObjectId, admin user's ID from session)
- `auth_level` (string, must verify = 'admin')

**Post Data (displayed in table):**
- `_id` (ObjectId, MongoDB ID)
- `content` (string, post message/text)
- `author_id` (ObjectId, user who created post)
- `author_name` (string, first + last name of author)
- `createdAt` (date, post creation timestamp)
- `likes_count` (number, total likes)
- `comments_count` (number, total comments)

**Date Filter Data:**
- `startDate` (date, filter posts on or after this date, format: MM/DD/YYYY or ISO)
- `endDate` (date, filter posts on or before this date, format: MM/DD/YYYY or ISO)
- Both optional, but if both provided: startDate must be <= endDate

**Pagination Data:**
- `page` (number, starting at 1)
- `limit` (number, posts per page)
- `total` (number, total posts in database or filtered results)
- `pages` (number, calculated as Math.ceil(total / limit))

**Validation Data:**
- Start Date: optional, valid date format (MM/DD/YYYY or YYYY-MM-DD)
- End Date: optional, valid date format (MM/DD/YYYY or YYYY-MM-DD)
- End Date cannot be before Start Date (validation error)
- Date range is inclusive (includes start and end dates)

**Post Content:**
- Post excerpt/preview: first 100-200 characters of content
- Full content available on hover or in confirmation modal
- Author name displayed alongside post

---

## Tech Constraints (Feature-Level)

- Use React components for page structure and modals
- Use `useEffect()` to fetch posts on page load and when filters/pagination change
- Use `useState()` to manage post list, date filters, pagination state
- Use Fetch API for GET and DELETE requests
- Implement debouncing for date filter input to avoid excessive API calls (e.g., 300ms delay)
- Date filtering can be done on frontend or backend (recommend backend)
- Pagination handled on backend using MongoDB skip/limit or similar
- Delete confirmation modal should be blocking (user cannot interact with page behind modal)
- Dates should be formatted consistently (e.g., "MM/DD/YYYY" or "Mar 16, 2026")
- All colors must conform to Color Palette
- Handle loading states (display spinner while fetching data)
- Handle empty states (no posts found after filter)
- Handle error states (display error message if fetch/delete fails)
- Display success messages for delete operations
- Admin-only access: verify auth_level = 'admin' before rendering page
- Redirect non-admin users to /home if attempting to access Content Manager
- Prevent accidental deletions with confirmation modal
- Do not reload page after delete (use state updates)
- Date validation: endDate cannot be before startDate
- Post content preview in table (truncate long posts with ellipsis)
- Full post content displayed in confirmation modal
- Consider keyboard navigation for accessibility
- Make sure Delete button is visually distinct (red color recommended)

---

## Acceptance Criteria

- [ ] Content Manager page is only accessible to admin users (auth_level = 'admin')
- [ ] Non-admin users are redirected to /home if attempting to access Content Manager
- [ ] Page displays a table with all posts on initial load
- [ ] Table displays Content, Author, Date Created columns
- [ ] Table displays Actions column with Delete button
- [ ] Date Start input field is present and functional
- [ ] Date End input field is present and functional
- [ ] Date filters trigger automatically as user types (no submit button needed)
- [ ] Date format is consistent and clear (e.g., MM/DD/YYYY)
- [ ] Posts are filtered correctly by Start Date only
- [ ] Posts are filtered correctly by End Date only
- [ ] Posts are filtered correctly when both Start Date and End Date are entered
- [ ] Date range is inclusive (includes posts on start and end dates)
- [ ] Date validation prevents end date before start date
- [ ] Select All button is present and functional
- [ ] Clicking Select All clears all date filters
- [ ] Clicking Select All displays all posts from backend
- [ ] Clicking Select All resets pagination to page 1
- [ ] Results-Per-Page dropdown is present
- [ ] Dropdown options include at least: 5, 10, 15, 25, 50
- [ ] Default selection is 10 posts per page
- [ ] Changing dropdown value reloads table with new page size
- [ ] Table displays correct number of posts based on selected page size
- [ ] Pagination controls display at bottom/top of table
- [ ] Pagination shows correct page numbers and total pages
- [ ] Previous button is disabled on first page
- [ ] Next button is disabled on last page
- [ ] Clicking page number navigates to that page
- [ ] Pagination triggers table refresh without full page reload
- [ ] Delete button is present for each post row
- [ ] Clicking Delete opens confirmation modal
- [ ] Confirmation modal displays post content preview
- [ ] Confirmation modal displays author name
- [ ] Confirmation modal displays creation date
- [ ] Confirmation modal displays warning message
- [ ] Confirmation modal has Delete and Cancel buttons
- [ ] Confirmation modal is visually distinct from page content
- [ ] Clicking Delete in modal sends DELETE request to backend
- [ ] Post is removed from system after successful deletion
- [ ] Post is removed from table after successful deletion
- [ ] Associated comments are deleted when post is deleted
- [ ] Success message displays after successful deletion
- [ ] Confirmation modal closes after deletion
- [ ] Clicking Cancel in modal closes without deleting
- [ ] Error message displays if fetch fails
- [ ] Error message displays if delete fails
- [ ] Error message displays if date range is invalid
- [ ] "No posts found" message displays if filter returns no results
- [ ] Loading spinner/message displays while data is fetching
- [ ] Post content is truncated in table with ellipsis for long posts
- [ ] Full post content displays in confirmation modal
- [ ] All text uses Navy color (#1F2340) or appropriate palette color
- [ ] Table styling matches design system
- [ ] Modal styling matches design system
- [ ] Buttons are appropriately colored (Delete button is red or warning color)
- [ ] Page layout is responsive and readable
- [ ] No console errors or warnings
- [ ] Filter performance is acceptable (no lag when typing dates)
- [ ] Pagination loading is smooth

---

## Notes for the AI

- **Admin Check:** Verify `auth_level === 'admin'` before rendering Content Manager. Use ProtectedRoute or similar pattern.

- **Date Filter Implementation:** Consider debouncing the date inputs (300ms recommended) to avoid making API call on every keystroke. Backend should support `startDate` and `endDate` query parameters.

- **Date Filtering Logic:** Query posts where `createdAt >= startDate` AND `createdAt <= endDate`. If only startDate provided: `createdAt >= startDate`. If only endDate: `createdAt <= endDate`. Both are optional.

- **Date Format:** Choose consistent format (e.g., "MM/DD/YYYY" for input, "Mar 16, 2026" for display). Use JavaScript Date API or date library for parsing and validation.

- **Select All Button:** When clicked, clear date filters completely and fetch all posts. Reset pagination to page 1. This is essentially a "reset filters" button.

- **Pagination:** Implement on backend using MongoDB's `skip()` and `limit()` methods. Formula: `skip = (page - 1) * limit`.

- **Delete Confirmation:** Modal should be blocking - user cannot interact with page behind it. Display post preview (first 200 chars) so user knows what they're deleting.

- **Cascade Delete:** When deleting a post, ensure associated comments are also deleted (backend logic in DELETE /posts/:postId).

- **Error Handling:** Each operation (fetch, delete) should have try/catch or .catch() handler. Display user-friendly error messages. Specific messages for date validation errors.

- **Success Messages:** Use toast or inline messages. Auto-dismiss after 3-5 seconds or allow dismiss.

- **Post Preview:** In table, truncate post content to 100-200 characters with "..." ellipsis. Display full content in confirmation modal.

- **Styling:**
  - Use flexbox or grid for table layout
  - Date input fields should be clear with placeholder text (e.g., "MM/DD/YYYY")
  - Delete button should be small icon or compact button
  - Delete button should use red/warning color to indicate dangerous action
  - Modal should use overlay background (semi-transparent dark)
  - Modal content should be centered and elevated (box-shadow or z-index)
  - Select All button should be visually distinct (primary color recommended)

- **Performance:** Implement pagination to avoid rendering hundreds of posts at once. Consider virtualization if table grows very large.

- **Accessibility:** Ensure date input labels are properly associated with inputs. Make buttons keyboard accessible. Use semantic HTML where possible. Consider date picker UI if beneficial for UX.

- **Related Features:**
  - This feature complements the Admin Dashboard - add Content Manager link to admin cards
  - Ensure consistent styling with User Manager and other admin pages
  - Use same Color Palette as rest of application

---

## Integration Notes

This feature is the implementation of the "Content Manager" card placeholder in the Admin Dashboard. It works independently from the User Manager feature and provides admins with full control over content moderation. When a post is deleted, all associated comments should also be removed (cascade delete at backend level).

The Content Manager page should follow the same authentication, styling, and layout patterns as the rest of the admin section to provide consistent user experience. Consider adding audit/moderation logs in future iterations to track what content was deleted and by which admin.
