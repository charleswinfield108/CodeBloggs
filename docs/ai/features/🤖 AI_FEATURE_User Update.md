# 🤖 AI_FEATURE_User Update

---

## Feature Identity

- **Feature Name:** User Update
- **Related Area:** Admin / User Management

---

## Feature Goal

Provide a dedicated user update/edit form accessible from the User Manager, allowing administrators to modify user profile information, authentication credentials, and account settings with validation, confirmation, and secure state management. The User Update page ensures changes are intentional through confirmation modals and provides a clear return path to the User Manager without losing data context.

---

## Feature Scope

### In Scope (Included)

- User Update page accessible only from User Manager (admin users only)
- Pre-filled edit form with current user data
- All user fields editable: First Name, Last Name, Email, Birthdate, Occupation, Location, Auth Level
- Password update capability with validation
- Password repeat/confirm field for verification
- Password strength validation and requirements
- Form validation for all fields
- Return to User Manager button/link (without applying changes)
- Confirmation modal before applying final updates
- Success message after successful update
- Error handling and display
- Loading states during submission
- Professional styling using Color Palette
- Form state management (prevent loss of data on navigation)

### Out of Scope (Excluded)

- Password reset via email link
- Multi-factor authentication setup
- Account deactivation or suspension
- Audit logs of changes made
- Change history or version control
- Bulk field updates
- Custom field creation or modification
- Permission/role matrix configuration
- Profile picture upload
- Account recovery procedures

---

## Sub-Requirements (Feature Breakdown)

**Form Fields & Pre-fill:**
- First Name field pre-filled with current user data
- Last Name field pre-filled with current user data
- Email field pre-filled with current user data
- Birthdate field pre-filled with current user data (formatted consistently)
- Occupation field pre-filled with current user data
- Location field pre-filled with current user data
- Auth Level dropdown pre-filled with current user data ('basic' or 'admin')
- Password field (optional, for password change or update)
- Password Repeat/Confirm field (required if password field is filled)

**Form Validation:**
- First Name: required, string, min length 2, max length 50
- Last Name: required, string, min length 2, max length 50
- Email: required, valid email format, unique (except for current user being edited)
- Birthdate: optional, valid date format (MM/DD/YYYY or YYYY-MM-DD)
- Occupation: optional, string, max length 100
- Location: optional, string, max length 100
- Auth Level: required, enum ('basic' or 'admin')
- Password (if provided): min length 8, contains at least one uppercase, one lowercase, one number, one special character
- Password Repeat: must match Password field exactly
- Show validation error messages next to fields in real-time

**Return to Manager Button:**
- Button labeled "Return to Manager" or "Cancel"
- Button is visible and easily accessible (e.g., at top or bottom of form)
- Clicking button navigates back to User Manager (/admin/users or equivalent)
- Navigation occurs WITHOUT applying any form changes
- Unsaved changes should be discarded (no confirmation needed for return)
- Alternatively: Show confirmation if user has made changes ("Discard changes?")

**Confirmation Modal:**
- Modal appears when user clicks "Save" or "Update" button
- Modal displays summary of changes being made
- Modal shows old value vs new value for changed fields (optional but recommended)
- Modal displays clear warning message
- Modal has "Confirm" and "Cancel" buttons
- Modal is blocking (user cannot interact with form behind modal)
- Clicking "Confirm" submits the form to backend
- Clicking "Cancel" closes modal and returns to form (preserves entered data)

**Password Update Process:**
- If password field is blank, existing password is unchanged
- If password field is filled, both password AND password repeat must match
- If password field filled but repeat field is empty or mismatched: show error and prevent submission
- Password requirements displayed near password field (optional but recommended)
- Password repeat field shows error if it doesn't match password field
- Show/hide password toggle (optional but recommended for UX)

**Success & Error Handling:**
- Success message displays after successful update (e.g., "User updated successfully")
- Success message auto-dismisses after 3-5 seconds or allows manual dismiss
- After success, page redirects to User Manager with updated data
- Error message displays if update fails (e.g., "Email already exists", "Database error")
- Error message is user-friendly and specific
- Error message remains until user acknowledges or attempts to correct

**State Management:**
- Form data persists if user closes confirmation modal and clicks "Cancel"
- Form data is cleared after successful submission
- Form data is cleared when navigating back to User Manager
- No accidental data loss

---

## User Flow / Logic (High Level)

1. **Admin Navigates to User Update:**
   - Admin is on User Manager page
   - Admin clicks Edit button on a user row
   - Navigate to /admin/users/:id or /admin/users/edit/:id route
   - Page loads and fetches user data

2. **Form Pre-fills:**
   - User data fetches from backend
   - Form fields populate with current user information
   - All fields are ready for editing
   - Loading spinner disappears

3. **Admin Edits User Information:**
   - Admin modifies desired fields (e.g., First Name, Email, Occupation)
   - Form validation runs in real-time (optional)
   - Admin can see validation error messages
   - Admin can update password if needed (password + repeat must match)

4. **Admin Clicks Return to Manager:**
   - Admin clicks "Return to Manager" button
   - All unsaved changes are discarded
   - Navigate back to User Manager page
   - User list displays with no changes applied

5. **Admin Submits Form Changes:**
   - Admin clicks "Save" or "Update" button
   - Form validation runs (all required fields, valid format, password match)
   - If validation fails: show errors next to fields, don't proceed
   - If validation passes: confirmation modal appears

6. **Confirmation Modal Appears:**
   - Modal shows summary of changes (e.g., "First Name: John → James")
   - User review summary and confirms changes are correct
   - Admin clicks "Confirm" button in modal

7. **Update is Applied:**
   - Form data sent to backend via PUT /user/:id
   - Loading spinner displays while request is in-flight
   - Success message displays
   - Confirmation modal closes
   - Page redirects to User Manager
   - Updated user now shows in User Manager table

8. **Handle Errors:**
   - If validation error: show messages in form, don't submit
   - If backend error (email exists, etc.): show error message
   - If network error: show error message with retry option
   - Form data remains intact for user to correct and retry

9. **User Cancels Confirmation:**
   - Admin clicks "Cancel" in confirmation modal
   - Modal closes without submitting
   - Form data is preserved
   - Admin can continue editing or click Return to Manager

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- UserUpdate.jsx (or EditUser.jsx) — Main user update page component
- UserUpdateForm.jsx — Form component with all user fields
- ConfirmationModal.jsx — Modal displaying changes before submission
- FormField.jsx — Reusable form field with validation display
- PasswordField.jsx — Password field with show/hide toggle and validation

**Page Layout:**
```
┌──────────────────────────────────────────────┐
│           HEADER                             │
├────────┬──────────────────────────────────────┤
│  ADMIN │  EDIT USER                           │
│  NAV   ├──────────────────────────────────────┤
│        │ [Return to Manager] [Save] [Cancel]  │
│        │                                      │
│        │ Edit User - John Doe                 │
│        │                                      │
│        │ First Name: [John]                   │
│        │ Last Name: [Doe]                     │
│        │ Email: [john@example.com]            │
│        │ Birthdate: [01/15/1990]              │
│        │ Occupation: [Software Engineer]      │
│        │ Location: [San Francisco]            │
│        │ Auth Level: [basic ▼]                │
│        │                                      │
│        │ Password: [••••••••]                 │
│        │ (Leave blank to keep current)        │
│        │ Password Repeat: [••••••••]          │
│        │                                      │
│        │ [Return to Manager] [Cancel] [Save]  │
│        │                                      │
│        └──────────────────────────────────────┘
```

**Confirmation Modal Layout:**
```
┌────────────────────────────────────────────┐
│ Confirm Changes?                           │
├────────────────────────────────────────────┤
│ You are about to apply the following       │
│ changes to user John Doe:                  │
│                                            │
│ • First Name: John → James                 │
│ • Email: john@... → james@example.com      │
│ • Auth Level: basic → admin                 │
│                                            │
│ This action cannot be undone easily.       │
│ Please review carefully.                   │
├────────────────────────────────────────────┤
│ [Confirm]  [Cancel]                        │
└────────────────────────────────────────────┘
```

### Backend / API

- `GET /user/:id` — Fetch user data for form pre-fill
  - Input: `id` (user ID from URL parameter)
  - Output: `{ _id, first_name, last_name, email, birthdate, occupation, location, auth_level }`
  - Status: 200 success, 404 user not found, 401 unauthorized

- `PUT /user/:id` — Update user information
  - Input: `id` (user ID), body: `{ first_name, last_name, email, birthdate, occupation, location, auth_level, password (optional) }`
  - Output: `{ _id, first_name, last_name, email, birthdate, occupation, location, auth_level, message: "User updated successfully" }`
  - Status: 200 success, 400 validation error, 404 user not found, 409 email conflict, 401 unauthorized, 500 server error

---

## Data Used or Modified

**Input Data (from URL/session):**
- `user_id` (ObjectId, from URL parameter :id)
- `admin_id` (ObjectId, from session - verifying admin access)
- `auth_level` (string, must verify current user = 'admin')

**User Data (fetched and displayed):**
- `_id` (ObjectId, MongoDB ID - read only)
- `first_name` (string, editable)
- `last_name` (string, editable)
- `email` (string, editable, must validate uniqueness)
- `birthdate` (date, editable)
- `occupation` (string, editable)
- `location` (string, editable)
- `auth_level` (string, editable, enum: 'basic' or 'admin')

**Password Data (special handling):**
- `password` (string, optional, only for password change)
- `password_repeat` (string, optional, must match password if provided)
- `current_password` (optional - if requiring admin to verify with their own password before changing user's password)

**Form Validation Rules:**
- First Name: required, min 2 chars, max 50 chars, alphanumeric + spaces
- Last Name: required, min 2 chars, max 50 chars, alphanumeric + spaces
- Email: required, valid email regex, must be unique (except for current user)
- Birthdate: optional, valid date format (MM/DD/YYYY or YYYY-MM-DD)
- Occupation: optional, string, max 100 chars
- Location: optional, string, max 100 chars
- Auth Level: required, must be 'basic' or 'admin'
- Password (if provided): min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
- Password Repeat: must match password exactly (case-sensitive, all characters)

**Confirmation Modal Data:**
- Array of changed fields with old value → new value
- Format: `{ field: 'First Name', oldValue: 'John', newValue: 'James' }`
- Only show fields that actually changed

**State to Track:**
- Original user data (for comparison and cancel operations)
- Current form data (for editing)
- Validation errors (field-level)
- Is Loading (during fetch and submit)
- Show Confirmation Modal (boolean)
- Success/Error message (for display)

---

## Tech Constraints (Feature-Level)

- Use React components for page and form structure
- Use `useEffect()` to fetch user data on page load
- Use `useState()` to manage form data, validation errors, loading, modal, messages
- Use `useParams()` to get user ID from URL
- Use Fetch API for GET and PUT requests
- Implement client-side form validation before submission
- Validate on backend as well (never trust client data)
- Debounce email uniqueness check if doing async validation
- Password fields should be masked (type="password")
- Provide show/hide password toggle (optional but recommended)
- Confirmation modal should be blocking (overlay with semi-transparent background)
- Modal content should be elevated and centered
- Do not submit form if validation fails
- Do not submit form if password and password_repeat don't match
- Dates formatted consistently (e.g., "MM/DD/YYYY")
- All colors must conform to Color Palette
- Handle loading states (spinner while fetching or submitting)
- Handle empty/null states (if user data missing)
- Handle error states (display specific error messages)
- Display success messages for successful updates
- Implement debouncing for real-time validation (optional, ~300ms)
- Use controlled components for all form inputs
- Prevent page navigation loss of data (warn user if unsaved changes)
- Admin-only access: verify auth_level = 'admin'
- Compare original data with form data to determine what changed (for confirmation modal)
- Only include changed fields in PUT request (or include all, backend should handle)
- After successful update, redirect to User Manager (with success message ideally)
- Cancel button should discard changes and return to User Manager

---

## Acceptance Criteria

- [ ] User Update page is only accessible to admin users (auth_level = 'admin')
- [ ] Non-admin users are redirected to /home if attempting direct access
- [ ] Page loads with user data fetched from backend
- [ ] First Name field is pre-filled with current user first name
- [ ] Last Name field is pre-filled with current user last name
- [ ] Email field is pre-filled with current user email
- [ ] Birthdate field is pre-filled with current user birthdate
- [ ] Occupation field is pre-filled with current user occupation
- [ ] Location field is pre-filled with current user location
- [ ] Auth Level dropdown is pre-filled with current user auth level
- [ ] Password field is empty initially (not pre-filled)
- [ ] Password Repeat field is empty initially
- [ ] All fields are editable (user can click and modify)
- [ ] Return to Manager button is visible and functional
- [ ] Clicking Return to Manager navigates back to User Manager
- [ ] Clicking Return to Manager does NOT apply any form changes
- [ ] Cancel button cancels the operation and returns to User Manager
- [ ] Form validation runs client-side
- [ ] First Name validation shows error if empty or too short/long
- [ ] Last Name validation shows error if empty or too short/long
- [ ] Email validation shows error if empty or invalid format
- [ ] Email validation checks uniqueness (shows error if email exists)
- [ ] Birthdate validation shows error if invalid format
- [ ] Occupation validation shows error if too long
- [ ] Location validation shows error if too long
- [ ] Auth Level validation shows error if not 'basic' or 'admin'
- [ ] Password field shows requirements near it (min 8 chars, uppercase, lowercase, number, special char)
- [ ] Password validation shows error if less than 8 characters
- [ ] Password validation shows error if missing uppercase letter
- [ ] Password validation shows error if missing lowercase letter
- [ ] Password validation shows error if missing number
- [ ] Password validation shows error if missing special character
- [ ] Password Repeat field shows error if it doesn't match Password field
- [ ] Password Repeat field is required IF Password field is filled
- [ ] Password Repeat field is optional IF Password field is empty
- [ ] Save button is visible and functional
- [ ] Clicking Save with validation errors shows error messages and does NOT submit
- [ ] Clicking Save with valid form displays confirmation modal
- [ ] Confirmation modal displays summary of changes
- [ ] Confirmation modal shows old value → new value for each changed field
- [ ] Confirmation modal shows appropriate warning message
- [ ] Confirmation modal displays Confirm and Cancel buttons
- [ ] Clicking Confirm in modal submits form to backend
- [ ] Clicking Cancel in modal closes without submitting
- [ ] Form data is preserved if user clicks Cancel in confirmation modal
- [ ] Loading spinner displays while form is submitting
- [ ] Backend receives updated user data
- [ ] Backend validates all fields
- [ ] Backend checks email uniqueness (except for current user)
- [ ] Backend rejects update if validation fails
- [ ] Backend accepts update if all validations pass
- [ ] Backend hashes/encrypts password if provided
- [ ] Backend updates user record in database
- [ ] Success message displays after successful update
- [ ] Success message auto-dismisses after 3-5 seconds (or allows manual dismiss)
- [ ] Page redirects to User Manager after successful update
- [ ] Updated user information displays correctly in User Manager table
- [ ] Error message displays if email already exists
- [ ] Error message displays if other validation fails
- [ ] Error message displays if network/server error occurs
- [ ] Error message is user-friendly and specific
- [ ] Error messages remain visible until acknowledged
- [ ] Form data remains intact if error occurs (for retry)
- [ ] Loading spinner disappears after request completes
- [ ] All text uses Navy color (#1F2340) or appropriate palette color
- [ ] Form styling matches design system
- [ ] Modal styling matches design system
- [ ] Buttons are appropriately colored and styled
- [ ] Cancel/Return button is visually distinct from Save button
- [ ] Page layout is responsive and readable
- [ ] No console errors or warnings
- [ ] Browser back button behavior is handled (warn if unsaved changes)

---

## Notes for the AI

- **Admin Check:** Verify `auth_level === 'admin'` before rendering page. Redirect to /home if not admin.

- **URL Parameter:** Get user ID from URL using `useParams()` — typically `/admin/users/:id` or `/admin/users/edit/:id`.

- **Fetch User Data:** On component mount, fetch user data via `GET /user/:id`. Handle loading and error states.

- **Form State:** Maintain separate state for original data and current form data. Use original data to detect changes for confirmation modal.

- **Validation:**
  - Implement client-side validation (shows errors in real-time)
  - Validate on backend as well (never trust client)
  - Email uniqueness should check backend, optionally debounce
  - Password strength requires: min 8, 1 uppercase, 1 lowercase, 1 number, 1 special char
  - Password Repeat must match Password field exactly

- **Password Handling:**
  - If password field is empty, don't send password in PUT request (or send empty/null)
  - If password field is filled, require password_repeat and validate match before submission
  - Do NOT display password confirmation to user in confirmation modal (for security)
  - Backend should hash password with salt before storing

- **Confirmation Modal:**
  - Build list of changed fields by comparing original data with form data
  - Only display fields that actually changed
  - Format: "First Name: John → James"
  - Do NOT show password changes in confirmation (for security)
  - Modal should be blocking (use overlay)
  - Preserve form data if user cancels modal

- **Success/Error Messages:**
  - Success: "User updated successfully" (auto-dismiss after 3-5 seconds)
  - Error: Display specific error (e.g., "Email already exists")
  - Use toast or inline messages
  - Error messages persist until acknowledged

- **Navigation:**
  - Return to Manager button: navigate back to `/admin/users` without applying changes
  - After successful update: redirect to `/admin/users` with success message
  - Consider warning user if they have unsaved changes and try to navigate away

- **Styling:**
  - Use flexbox or grid for form layout
  - Group related fields (personal info, account settings, password)
  - Form fields should be clearly labeled
  - Error messages displayed in red next to field
  - Password field with show/hide toggle (eye icon)
  - Confirmation modal centered with semi-transparent overlay
  - Cancel button should be secondary color, Confirm should be primary

- **Related Features:**
  - This feature is triggered from User Manager ([🤖 AI_FEATURE_User Manager.md](./user-manager.feature.md))
  - Ensure consistent styling and navigation patterns
  - Use same Color Palette and component styles

---

## Integration Notes

This feature implements the Edit functionality referenced in the User Manager feature. When admin clicks "Edit" button on a user row in the User Manager table, the app navigates to this User Update page. After successfully updating a user, the app redirects back to User Manager with updated data displayed. This maintains context and workflow continuity for administrators managing multiple users.

The User Update page should follow the same authentication, styling, and layout patterns as the rest of the admin section to provide consistent user experience.
