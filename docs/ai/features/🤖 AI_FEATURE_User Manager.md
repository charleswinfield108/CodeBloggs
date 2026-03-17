🤖 AI_FEATURE_User Manager

---

## Feature Identity

- **Feature Name:** User Manager
- **Related Area:** Admin / Pages

---

## Feature Goal

Provide administrators with a comprehensive user management interface to view, search, filter, edit, and delete user accounts. The User Manager enables admins to maintain user data integrity, search for specific users quickly, manage user fields, and remove users from the system with confirmation steps to prevent accidental deletions.

---

## Feature Scope

### In Scope (Included)

- User Manager page accessible only to admin users (auth_level = 'admin')
- Table displaying all users with key information
- First Name and Last Name input fields for search filtering
- Real-time search functionality (auto-filtering as user types)
- Clear button to reset search filters and reload full user list
- Pagination control to navigate through multiple pages of users
- Results-per-page dropdown selector (configurable page size)
- Edit button for each user row
- Edit form allowing modification of all user fields
- Delete button for each user row
- Delete confirmation modal before user removal
- Visual feedback for search results
- Loading states for data fetching
- Error handling and display
- Professional styling using Color Palette
- Responsive layout for admin desktop use

### Out of Scope (Excluded)

- Bulk user operations (select multiple, bulk delete)
- User import/export functionality
- User role assignment or permission changes
- User ban or suspension features
- User activity logs or audit trails
- User email verification or resend
- Password reset management
- User segmentation or filtering by auth_level
- Advanced search with complex filters
- User statisticsoverview
- Two-factor authentication management
- Real-time user updates

---

## Sub-Requirements (Feature Breakdown)

**Search & Filter:**
- First Name input field for searching users by first name
- Last Name input field for searching users by last name
- Search filters by first name OR last name OR both (case-insensitive)
- Filtering triggers automatically as user types (no submit button needed)
- Results update in real-time as user types
- Empty fields clear corresponding filters

**Clear Button:**
- Clear button resets both First Name and Last Name input fields
- Clear button resets search filters and shows full user list
- Clear button reloads all users from backend
- Button is visually distinct and easily identifiable

**User Table Display:**
- Table displays all users (or filtered results)
- Table includes columns: First Name, Last Name, Email, Occupation, Location, Birthdate, Auth Level, Actions
- Table columns are properly aligned and readable
- Each row represents one user
- No duplicate entries in table

**Edit Functionality:**
- Edit button present in Actions column for each user
- Clicking Edit opens a form with all user fields (read more below)
- Edit form includes all user fields: First Name, Last Name, Email, Occupation, Location, Birthdate, Auth Level
- Edit form pre-fills with current user data
- Edit form has Save and Cancel buttons
- Clicking Save updates user in backend via PUT /user/:id endpoint
- Clicking Cancel closes form without saving
- Form displays validation errors if update fails
- Success message displays after successful update
- User table refreshes after successful update

**Delete Functionality:**
- Delete button present in Actions column for each user
- Clicking Delete triggers confirmation modal
- Confirmation modal displays user name and warning message
- Confirmation modal has "Delete" and "Cancel" buttons
- Clicking "Delete" in modal removes user from system
- Clicking "Cancel" closes modal without deleting
- Delete request sent to DELETE /user/:id endpoint
- User removed from table after successful deletion
- Success message displays after successful deletion
- Error message displays if deletion fails

**Pagination:**
- Table data is paginated (not all users on one page)
- Pagination controls display at bottom or top of table
- Pagination shows current page number and total pages
- Pagination buttons: Previous, page numbers, Next
- Clicking page number navigates to that page
- Previous button disabled on first page
- Next button disabled on last page
- Page updates table display without full page reload

**Results-Per-Page Dropdown:**
- Dropdown located near pagination or top-right of table
- Dropdown options: 5, 10, 15, 25 (or similar)
- Default selection: 10 users per page
- Changing dropdown value reloads table with new page size
- Returns to page 1 when page size changes
- Selected value persists in dropdown UI

---

## User Flow / Logic (High Level)

1. **Admin Navigates to User Manager:**
   - Admin user logs in
   - Admin clicks User Manager card or link from Admin Dashboard
   - Navigate to /admin/users route (or similar)
   - Page loads and displays full user list in table

2. **Search & Filter Users:**
   - Admin types in First Name input field
   - Table filters in real-time showing only users matching first name
   - Admin types in Last Name input field
   - Table filters showing users matching both filters
   - Admin can clear either or both fields to adjust filters

3. **Clear All Filters:**
   - Admin clicks Clear button
   - First Name and Last Name fields reset to empty
   - All filters removed
   - Full user list reloads and displays all users

4. **Browse Paginated Results:**
   - Table displays 10 users per page by default
   - Admin clicks "Next" button to view more users
   - Page 2 users display in table
   - Admin clicks "Previous" to return to page 1

5. **Change Results Per Page:**
   - Admin clicks Results-Per-Page dropdown
   - Selects "25" from dropdown options
   - Table reloads showing 25 users per page
   - Pagination recalculates and updates

6. **Edit User Information:**
   - Admin clicks Edit button on a user row
   - Navigate to User Update page ([user-update.feature.md](./user-update.feature.md))
   - User Update page displays edit form
   - Admin updates desired fields
   - Admin clicks Save button
   - Confirmation modal appears
   - Admin confirms changes
   - Backend updates user record
   - Redirects back to User Manager
   - User table refreshes and shows updated data
   - Success message displays

7. **Delete User Account:**
   - Admin clicks Delete button on a user row
   - Confirmation modal appears
   - Modal displays user name and warning message
   - Admin clicks "Delete" button in modal
   - Backend removes user record
   - Confirmation modal closes
   - User removed from table
   - Success message displays

8. **Handle Errors:**
   - If search returns no results: display "No users found" message
   - If fetch fails: display error message and retry option
   - If edit fails: display error message with details
   - If delete fails: display error message with details

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- AdminUsers.jsx (or UserManager.jsx) — Main user manager page component
- UserTable.jsx — Table component displaying users
- UserTableRow.jsx — Individual user row component
- DeleteConfirmationModal.jsx — Modal for delete confirmation
- Pagination.jsx — Pagination control component
- SearchFilters.jsx — Search/filter input component

**Page Layout:**
```
┌──────────────────────────────────────────────┐
│           HEADER                             │
├────────┬──────────────────────────────────────┤
│  ADMIN │  USER MANAGER                        │
│  NAV   ├──────────────────────────────────────┤
│        │ SEARCH FILTERS:                      │
│        │ [First Name]  [Last Name]  [Clear]   │
│        ├──────────────────────────────────────┤
│        │ Results Per Page: [Dropdown ▼]       │
│        │                                      │
│        │ ┌──────────────────────────────────┐ │
│        │ │ First │ Last  │ Email │ Actions │ │
│        │ ├──────────────────────────────────┤ │
│        │ │ John  │ Doe   │ jo... │[✎][🗑]  │ │
│        │ │ Jane  │ Smith │ ja... │[✎][🗑]  │ │
│        │ │ Bob   │ Brown │ bo... │[✎][🗑]  │ │
│        │ └──────────────────────────────────┘ │
│        │ Pagination: [< 1 2 3 >]              │
│        │                                      │
│        └──────────────────────────────────────┘
```

**Delete Confirmation Modal Layout:**
```
┌──────────────────────────────────────┐
│ Delete User?                         │
├──────────────────────────────────────┤
│ Are you sure you want to delete      │
│ John Doe?                            │
│                                      │
│ This action cannot be undone.        │
├──────────────────────────────────────┤
│ [Delete]  [Cancel]                   │
└──────────────────────────────────────┘
```

### Backend / API

- `GET /users` — Fetch all users
  - Input: Query parameters (optional): `page`, `limit`, `firstName`, `lastName`
  - Output: `{ users: [ { _id, first_name, last_name, email, birthdate, occupation, location, auth_level }, ... ], total: count, pages: number }`
  - Status: 200 success, 500 server error

- `GET /user/:id` — Fetch single user details (for edit form pre-fill)
  - Input: `id` (user ID)
  - Output: `{ _id, first_name, last_name, email, birthdate, occupation, location, auth_level }`
  - Status: 200 success, 404 user not found

- `PUT /user/:id` — Update user information
  - Input: `id` (user ID), body: `{ first_name, last_name, email, birthdate, occupation, location, auth_level }`
  - Output: `{ _id, first_name, last_name, email, birthdate, occupation, location, auth_level }`
  - Status: 200 success, 400 validation error, 404 user not found, 500 server error

- `DELETE /user/:id` — Delete user account
  - Input: `id` (user ID)
  - Output: `{ message: "User deleted successfully" }` or `{ success: true }`
  - Status: 200 success, 404 user not found, 500 server error

---

## Data Used or Modified

**Input Data (from session):**
- `user_id` (ObjectId, admin user's ID from session)
- `auth_level` (string, must verify = 'admin')

**User Data (displayed in table):**
- `_id` (ObjectId, MongoDB ID)
- `first_name` (string)
- `last_name` (string)
- `email` (string)
- `birthdate` (date)
- `occupation` (string)
- `location` (string)
- `auth_level` (string, enum: 'basic' or 'admin')

**Search/Filter Data:**
- `firstName` (string, optional, case-insensitive search)
- `lastName` (string, optional, case-insensitive search)
- Combination of both fields creates AND filter

**Pagination Data:**
- `page` (number, starting at 1)
- `limit` (number, users per page)
- `total` (number, total users in database)
- `pages` (number, calculated as Math.ceil(total / limit))

**Form Data (Edit):**
- All user fields from User model
- Auth Level dropdown: ['basic', 'admin']

**Validation Data:**
- First Name: required, string, min length 2, max length 50
- Last Name: required, string, min length 2, max length 50
- Email: required, valid email format, unique (except for current user)
- Birthdate: optional, valid date format (MM/DD/YYYY or YYYY-MM-DD)
- Occupation: optional, string, max length 100
- Location: optional, string, max length 100
- Auth Level: required, enum ('basic' or 'admin')

---

## Tech Constraints (Feature-Level)

- Use React components for page structure and modals
- Use `useEffect()` to fetch users on page load and when pagination/filters change
- Use `useState()` to manage user list, search filters, pagination state, and form data
- Use Fetch API for GET, PUT, DELETE requests
- Implement debouncing for search input to avoid excessive API calls (e.g., 300ms delay)
- Search filtering can be done on frontend or backend (recommend backend for scalability)
- Pagination handled on backend using MongoDB skip/limit or similar
- Delete confirmation modal should be blocking (user cannot interact with page behind modal)
- Dates should be formatted consistently (e.g., "MM/DD/YYYY" or "Jan 15, 1990")
- All colors must conform to Color Palette
- Handle loading states (display spinner while fetching data)
- Handle empty states (no users found after search)
- Handle error states (display error message if fetch/update/delete fails)
- Display success messages for edit and delete operations
- Admin-only access: verify auth_level = 'admin' before rendering page
- Redirect non-admin users to /home if attempting to access User Manager
- Prevent accidental deletions with confirmation modal
- Do not reload page after delete (use state updates)
- Use controlled components for form inputs
- Form validation on frontend before submission (optional but recommended)
- Consider keyboard navigation for accessibility
- Make sure Delete button is visually distinct (red color recommended)

---

## Acceptance Criteria

- [ ] User Manager page is only accessible to admin users (auth_level = 'admin')
- [ ] Non-admin users are redirected to /home if attempting to access User Manager
- [ ] Page displays a table with all users on initial load
- [ ] Table displays First Name, Last Name, Email, Occupation, Location, Birthdate, Auth Level columns
- [ ] Table displays Actions column with Edit and Delete buttons
- [ ] First Name input field is present and functional
- [ ] Last Name input field is present and functional
- [ ] Search filters trigger automatically as user types (no submit button needed)
- [ ] Search results are filtered correctly by First Name
- [ ] Search results are filtered correctly by Last Name
- [ ] Search results are filtered correctly when both First Name and Last Name are entered
- [ ] Search is case-insensitive
- [ ] Clear button is present and resets both input fields
- [ ] Clear button reloads full user list
- [ ] Results-Per-Page dropdown is present
- [ ] Dropdown options include at least: 5, 10, 15, 25
- [ ] Default selection is 10 users per page
- [ ] Changing dropdown value reloads table with new page size
- [ ] Table displays correct number of users based on selected page size
- [ ] Pagination controls display at bottom/top of table
- [ ] Pagination shows correct page numbers and total pages
- [ ] Previous button is disabled on first page
- [ ] Next button is disabled on last page
- [ ] Clicking page number navigates to that page
- [ ] Pagination triggers table refresh without full page reload
- [ ] Edit button is present for each user row
- [ ] Clicking Edit navigates to User Update page
- [ ] User Update page displays pre-filled form with user data
- [ ] Table refreshes after successful edit from User Update page
- [ ] Success message displays after successful edit
- [ ] Delete button is present for each user row
- [ ] Clicking Delete opens confirmation modal
- [ ] Confirmation modal displays user name and warning message
- [ ] Confirmation modal has Delete and Cancel buttons
- [ ] Confirmation modal is visually distinct from page content
- [ ] Clicking Delete in modal sends DELETE request to backend
- [ ] User is removed from system after successful deletion
- [ ] User is removed from table after successful deletion
- [ ] Success message displays after successful deletion
- [ ] Confirmation modal closes after deletion
- [ ] Clicking Cancel in modal closes without deleting
- [ ] Error message displays if fetch fails
- [ ] Error message displays if delete fails
- [ ] "No users found" message displays if search returns no results
- [ ] Loading spinner/message displays while data is fetching
- [ ] All text uses Navy color (#1F2340) or appropriate palette color
- [ ] Table styling matches design system
- [ ] Modal styling matches design system
- [ ] Buttons are appropriately colored (Delete button is red or warning color)
- [ ] Page layout is responsive and readable
- [ ] No console errors or warnings
- [ ] Search performance is acceptable (no lag when typing)
- [ ] Pagination loading is smooth

---

## Notes for the AI

- **Admin Check:** Verify `auth_level === 'admin'` before rendering User Manager. Use ProtectedRoute or similar pattern.

- **Search Implementation:** Consider debouncing the search inputs (300ms recommended) to avoid making API call on every keystroke. Backend should support `firstName` and `lastName` query parameters.

- **Filtering Logic:** If using backend filtering, send requests with `?firstName=John&lastName=Doe` etc. If filtering on frontend, fetch all users once and filter in memory (not recommended for large datasets).

- **Pagination:** Implement on backend using MongoDB's `skip()` and `limit()` methods. Formula: `skip = (page - 1) * limit`.

- **Edit Functionality:** When user clicks Edit button, navigate to User Update page with user ID in URL. See [user-update.feature.md](./user-update.feature.md) for implementation details.

- **Delete Confirmation:** Modal should be blocking - user cannot interact with page behind it. Disable scroll if desired.

- **Date Formatting:** Choose consistent format (e.g., "MM/DD/YYYY" or "Jan 15, 1990") and use JavaScript Date or moment.js library.

- **Error Handling:** Each operation (fetch, delete) should have try/catch or .catch() handler. Display user-friendly error messages.

- **Success Messages:** Use toast or inline messages. Auto-dismiss after 3-5 seconds or allow dismiss.

- **Styling:**
  - Use flexbox or grid for table layout
  - Edit and Delete buttons should be small icons or compact buttons
  - Delete button should use red/warning color to indicate dangerous action
  - Modal should use overlay background (semi-transparent dark)
  - Modal content should be centered and elevated (box-shadow or z-index)

- **Performance:** Implement pagination to avoid rendering hundreds of users at once. Consider virtualization if table grows very large.

- **Accessibility:** Ensure form labels are properly associated with inputs. Make buttons keyboard accessible. Use semantic HTML where possible.

- **Related Features:**
  - This feature complements the Admin Dashboard - add User Manager link to admin cards
  - Edit button navigates to User Update page ([user-update.feature.md](./user-update.feature.md))
  - Ensure consistent styling with other admin pages
  - Use same Color Palette as rest of application

---

## Integration Notes

This feature is the implementation of the "User Manager" card placeholder in the Admin Dashboard. When an admin clicks Edit, it navigates to the User Update page ([user-update.feature.md](./user-update.feature.md)) where the actual form editing occurs. After successful edit or deletion, the app redirects back to User Manager with updated data displayed. This maintains context and workflow continuity for administrators managing multiple users.

The User Manager page should follow the same authentication, styling, and layout patterns as the rest of the admin section to provide consistent user experience.
