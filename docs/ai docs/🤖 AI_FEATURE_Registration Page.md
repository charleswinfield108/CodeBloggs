🤖 AI_FEATURE_Registration Page

---

## Feature Identity

- **Feature Name:** Registration Page
- **Related Area:** Frontend / Authentication

---

## Feature Goal

Allow new users to create an account by providing personal information and credentials. Validate all fields before submission, handle errors gracefully, and create a new user account with default auth level set to 'basic'. Upon successful registration, allow user to navigate to the login page.

---

## Feature Scope

### In Scope (Included)

- Registration page component with seven required input fields
- Form validation for all fields (required, format, length constraints)
- Real-time or on-submit validation with clear error messages
- Birthdate input using HTML date picker component
- Email validation (required, valid format, unique check)
- Password requirements and validation
- String field validation (max length constraints)
- Submit button to create new user account
- Error message display for invalid form submission
- Prevention of form submission if validation fails
- POST /register request with all user details
- Auto-set auth_level to 'basic' for all new users (backend)
- Link to login page below submit button
- Clear visual design using Color Palette
- Success message or redirect after successful registration

### Out of Scope (Excluded)

- Username field (using email as unique identifier)
- Email verification or confirmation
- T&C or privacy policy acceptance checkbox
- CAPTCHA or bot prevention
- Password strength meter (visual indicator)
- Profile picture upload
- Phone number verification

---

## Sub-Requirements (Feature Breakdown)

- First Name input field (required, string, max 50 characters)
- Last Name input field (required, string, max 50 characters)
- Email input field (required, valid email format, must be unique)
- Birthdate input using date picker (required, must be a valid date)
- Password input field (required, string, masked input)
- Occupation input field (required, string, max 50 characters)
- Location input field (required, string, max 50 characters)
- Form validation prevents submission if any field is empty or invalid
- Error messages display for each invalid field (inline or summary)
- Email uniqueness is checked against database (backend validation)
- Submit button sends POST /register request with all fields
- Auth level is automatically set to 'basic' (backend implementation)
- Successful registration shows success message or redirects to login
- Link to login page appears below submit button
- Form errors clear when user corrects the field

---

## User Flow / Logic (High Level)

1. **User Arrives at Registration Page:**
   - User clicks "Sign Up" link from login page or navigates to /register
   - Registration form displays with seven empty input fields
   - Submit button is initially enabled (optional: disabled until form is valid)

2. **User Fills Out Form:**
   - User enters First Name, Last Name, Email, Occupation, Location (text fields)
   - User selects Birthdate using date picker
   - User enters Password in masked input field
   - Real-time validation highlights required fields or shows errors (optional)

3. **User Submits Form:**
   - Form validates all fields on submit
   - If any field is empty or invalid:
     - Display error messages for invalid fields
     - Prevent form submission
     - Keep user on registration page
   - If all fields are valid:
     - Send POST /register request with all data
     - Show loading spinner/message during request

4. **Backend Processes Registration:**
   - Backend receives registration data
   - Backend validates all fields (same as frontend)
   - Backend checks if email already exists (uniqueness)
   - If email exists → return error
   - If validation passes → create new user with auth_level = 'basic'
   - Return success response

5. **Frontend Handles Response:**
   - If successful → display success message and link to login
   - Or automatically redirect to /login page after 2-3 seconds
   - If failed (email exists, validation error) → display error message
   - Allow user to correct and retry

6. **User Returns to Login:**
   - User clicks "Back to Login" link
   - User navigates to /login page
   - User can now log in with the registered email and password

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- Register.jsx — Main registration page component
- RegistrationForm.jsx (optional) — Form component with inputs and validation

**Layout:**
- Registration page is independent (no header or navbar)
- Centered form with seven input fields
- Birthdate field uses HTML `<input type="date">` or date picker library
- Submit button below all inputs
- "Back to Login" link below submit button
- Error message display area (shows field-specific or summary errors)
- Success message display (appears after successful registration)

**Form Fields:**
1. First Name (text input, required, max 50 chars)
2. Last Name (text input, required, max 50 chars)
3. Email (email input, required, valid format)
4. Birthdate (date picker, required)
5. Password (password input, required, masked)
6. Occupation (text input, required, max 50 chars)
7. Location (text input, required, max 50 chars)

### Backend / API

- `POST /register` — Create new user account
  - Input: `first_name`, `last_name`, `email`, `birthdate`, `password`, `occupation`, `location`
  - Output: `{ user_id, message: "User created successfully" }` or `{ error: "Email already exists" }`
  - Status codes:
    - 201 — user created successfully
    - 400 — validation error (missing fields, invalid format)
    - 409 — email already exists (conflict)

---

## Data Used or Modified

**Input Data (from form):**
- first_name (string, required, max 50 chars, trim whitespace)
- last_name (string, required, max 50 chars, trim whitespace)
- email (string, required, valid email format, unique, trimmed)
- birthdate (date, required, must be valid date)
- password (string, required, masked on frontend)
- occupation (string, required, max 50 chars, trim whitespace)
- location (string, required, max 50 chars, trim whitespace)

**Data Created (backend):**
- user_id (automatically generated ObjectId)
- auth_level (automatically set to 'basic', not from user input)
- password (hashed before storage, never sent back to frontend)
- createdAt (timestamp, automatically set)

**Validations:**
- All fields required (no empty fields)
- Email: valid email format (regex or validation library)
- Email: must be unique (not already in database)
- String fields: max 50 characters
- Birthdate: valid date
- Password: not empty (additional constraints optional: min length, complexity)

**Error Messages:**
- "First Name is required"
- "Last Name is required"
- "Email is required"
- "Email must be a valid email address"
- "Email already exists. Please log in or use a different email."
- "Birthdate is required"
- "Please select a valid birthdate"
- "Password is required"
- "Occupation is required"
- "Location is required"
- "First Name must not exceed 50 characters"
- "Last Name must not exceed 50 characters"
- (similar for Occupation, Location)

---

## Tech Constraints (Feature-Level)

- Use React state management (useState) for form data
- Use HTML `<input type="date">` for birthdate picker (native) or date library
- Use Fetch API for POST /register request
- Validate email using regex or third-party validation library
- Validate all fields client-side (quick feedback) and server-side (security)
- Use React Router for navigation to /login
- Password must be sent as plain text over HTTPS (hashed on backend, never stored plain)
- Do not log passwords or sensitive data to console
- All colors must conform to Color Palette
- Display error messages clearly (use Accent or Navy color)
- Disable submit button while request is pending (optional but recommended)
- Clear errors when user starts typing in a field (optional)

---

## Acceptance Criteria

- [ ] Registration page displays with seven input fields
- [ ] Email, Birthdate, and Password fields use appropriate input types
- [ ] Birthdate field uses date picker (type="date" or library)
- [ ] Submit button attempts form submission on click
- [ ] Form shows error if First Name is empty
- [ ] Form shows error if Last Name is empty
- [ ] Form shows error if Email is empty
- [ ] Form shows error if Email format is invalid
- [ ] Form shows error if Birthdate is empty
- [ ] Form shows error if Password is empty
- [ ] Form shows error if Occupation is empty
- [ ] Form shows error if Location is empty
- [ ] Form prevents submission if any field is invalid
- [ ] Form prevents submission if email exceeds max length
- [ ] Form prevents submission if first/last name exceed 50 chars
- [ ] Form prevents submission if occupation/location exceed 50 chars
- [ ] Errors display clearly (inline or in error summary)
- [ ] Successful registration sends POST /register with all fields
- [ ] Auth level is set to 'basic' by backend (verified in database)
- [ ] Duplicate email shows error message ("Email already exists")
- [ ] Successful registration displays success message or redirects to /login
- [ ] "Back to Login" link navigates to /login page
- [ ] Network errors display appropriate error message
- [ ] Loading state shows while registration is processing
- [ ] No console errors or warnings
- [ ] Styling matches Color Palette (Primary Purple #8D88EA, Text Navy #1F2340)

---

## Notes for the AI

- Use the browser's native date picker (`<input type="date">`) for maximum compatibility
- Frontend validation should match backend validation exactly (same rules)
- Email validation should be done both client-side (user feedback) and server-side (security)
- Always send passwords over HTTPS; never log them to console
- Hash passwords on the backend before storing (use bcrypt or similar)
- Do not send plain passwords back to frontend in any response
- Trim whitespace from string fields on both frontend and backend
- Check email uniqueness on backend before creating user (handle race condition)
- Store auth_level in the User schema as 'basic' by default via schema default
- Consider adding password strength requirements (min length, uppercase, special chars)
- The birthdate picker should accept valid dates; consider adding min/max constraints
- Show loading spinner or disable submit button during POST request
- Clear form or keep it populated after unsuccessful registration? (design choice - recommend keeping data)
- Consider adding a password confirmation field for better UX
- Error messages should be specific (not generic "Form is invalid")
- Display one error per field inline, or use an error summary approach (choose one)
