# 🤖🛠️ AI Feature Specification - Login Page

**Feature Goal:** Provide a secure, user-friendly login page that authenticates users with email and password credentials and directs them to the application dashboard upon successful authentication.

---

## 📋 Scope

### In Scope
- Login form with email and password inputs
- Form validation (email format, required fields)
- Authentication via POST /session/login endpoint
- Show/hide password toggle (eye icon)
- Error messaging for invalid credentials
- Loading state during authentication
- Redirect to `/home` on successful login
- Link to registration page for new users
- Persistent session storage in localStorage
- Brand-consistent styling and layout

### Out of Scope
- Password reset functionality (v2 feature)
- OAuth/Social login (v2 feature)
- Multi-factor authentication (v2 feature)
- Login history/audit logs (backend feature)
- Account lockout after failed attempts (v2 feature)

---

## 🎯 Requirements Breakdown

### 1. Login Page - Created
**Requirement:** A login page is created and uses email and password as credentials to log in.

**User Flow:**
1. User navigates to `/login`
2. User sees centered login card with CodeBloggs branding
3. User enters email and password
4. User clicks "Login" button
5. Form validates inputs:
   - Email must be valid format
   - Both fields required
6. On valid form:
   - Loading indicator shows
   - POST request sent to `/session/login`
   - Backend validates credentials
7. On success:
   - Session data stored in localStorage
   - User redirected to `/home`
8. On failure:
   - Error message displayed
   - User can retry with different credentials

**Implementation Details:**
- Form fields: email, password
- Password input type toggles between "password" and "text"
- Eye icon button shows/hides password
- Submit button: "Login" text
- Loading state: Button disabled, "Logging in..." text
- Error display: Red background (#FEF2F2), red text (#DC2626)
- Styling: Purple gradient card, white text, brand colors

---

### 2. Login Page - Link to Registration
**Requirement:** Below the login submit button, there must be a working link to the registration page.

**User Flow:**
1. User on `/login` page
2. Below login button, link reads: "Don't have an account? Sign up here"
3. User clicks link
4. User navigated to `/register` page
5. Registration page displays (independent layout, no header/sidebar)

**Implementation Details:**
- Link text: "Don't have an account? Sign up here"
- Link styling: 
  - Default color: #666 or #8D88EA
  - Hover color: #6C63D9 (darker, underlined)
- Link positioned: Below submit button
- Click action: Navigate to `/register` via React Router
- No page reload (SPA navigation)

---

## 🗂️ Interfaces Involved

### Pages/Components

#### Login Component (`/client/src/pages/Login.jsx`)
**Purpose:** Main authentication page for existing users

**Props:** None

**State:**
- `formData`: { email: string, password: string }
- `error`: string | null
- `loading`: boolean
- `showPassword`: boolean

**Methods:**
- `handleChange()`: Update form field
- `handleSubmit()`: Validate and submit login form
- `handleShowPassword()`: Toggle password visibility

**External Calls:**
- `useNavigate()`: Navigate to /home on success
- `useSession()`: Access session login method
- `fetch()`: POST to /session/login

**Error Handling:**
- Email validation regex
- Required field validation
- API error messages display
- Network error handling

---

### API Endpoints Used

#### POST /session/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "session_token": "token_string",
  "user_id": "user_id",
  "first_name": "John",
  "last_name": "Doe",
  "auth_level": "basic"
}
```

**Response Error (400/403/500):**
```json
{
  "message": "Invalid email or password."
}
```

---

## 📊 Data & Validations

### Form Validations
- **Email:**
  - Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - Required field
  - Trimmed of whitespace
  
- **Password:**
  - Required field
  - Minimum length: 1 character (backend handles min 6)
  - Can contain any characters

### Session Storage
**localStorage key:** `session`
**Value structure:**
```json
{
  "session_token": "string",
  "user_id": "string",
  "first_name": "string",
  "last_name": "string",
  "auth_level": "string"
}
```

### Expected Behavior
- Valid credentials → Successful authentication → Redirect to /home
- Invalid credentials → Error message → Stay on /login
- Network error → "An error occurred. Please try again." message
- Missing fields → "Please fill in all fields" message
- Invalid email format → "Please enter a valid email address" message
- Post-login session persists across page refresh (localStorage)

---

## ✅ Acceptance Criteria

### How to Verify It Works

#### Criteria 1: Login Form Displays Correctly
- [ ] Navigate to `/login`
- [ ] Page shows centered card with CodeBloggs logo (48px)
- [ ] Title: "Welcome to CodeBloggs, Please Login"
- [ ] Email input field visible and focused
- [ ] Password input field visible
- [ ] "Login" button visible and clickable
- [ ] Brand colors applied (#8D88EA primary, #6C63D9 hover)

#### Criteria 2: Form Validation Works
- [ ] Click Login with empty fields → Error: "Please fill in all fields"
- [ ] Enter invalid email format → Error: "Please enter a valid email address"
- [ ] Enter valid email but empty password → Error: "Please fill in all fields"
- [ ] Enter all valid inputs → No validation error

#### Criteria 3: Password Show/Hide Works
- [ ] Default: Password field is masked (type="password", shows dots)
- [ ] Default eye icon: Shows as 👁️‍🗨️ (hidden icon)
- [ ] Click eye icon → Password shows as text (type="text")
- [ ] Eye icon changes to 👁️ (showing icon)
- [ ] Click eye icon again → Password masked again
- [ ] Toggle works repeatedly without issues

#### Criteria 4: Authentication Flow Works
- [ ] Valid credentials (registered user) → Loading state shows
- [ ] Loading state: Button disabled, text changes to "Logging in..."
- [ ] Successful login → Redirect to `/home` (after 1-2 seconds)
- [ ] Session stored in localStorage with all required fields
- [ ] Page refresh → Still on `/home` (session persists)
- [ ] Invalid credentials → Error message displays: "An error occurred. Please try again."
- [ ] Invalid credentials → Stay on `/login` page
- [ ] User can retry login with correct credentials

#### Criteria 5: Registration Link Works
- [ ] Below Login button, link displays: "Don't have an account? Sign up here"
- [ ] Link is clickable (pointer cursor on hover)
- [ ] Link hover color changes (#6C63D9)
- [ ] Click link → Navigate to `/register` page
- [ ] No page reload occurs (SPA navigation)
- [ ] Back button in browser returns to `/login`

#### Criteria 6: Styling & UX
- [ ] Card has purple gradient background (#8D88EA to #A49EF0)
- [ ] Card has drop shadow for depth
- [ ] Form text is white on dark background
- [ ] Input fields have proper padding and borders
- [ ] Inputs have hover/focus states
- [ ] Error messages display with red background
- [ ] Button changes color on hover (#6C63D9)
- [ ] Footer (80px) displays at bottom with #8D88EA background
- [ ] Responsive: Card visible on mobile (no horizontal scroll)

#### Criteria 7: Edge Cases
- [ ] Very long email address accepted
- [ ] Very long password accepted
- [ ] Email with special characters but valid format (e.g., test+tag@example.com) accepted
- [ ] Special characters in password work correctly
- [ ] Rapid clicks on Login button don't submit multiple times (button disabled during request)
- [ ] Network timeout shows error message
- [ ] Page works without JavaScript errors in console

---

## 📝 Implementation Checklist

- [x] Create Login.jsx component
- [x] Add email and password input fields
- [x] Implement form validation (email regex, required fields)
- [x] Add show/hide password toggle with eye icon
- [x] Implement handleSubmit to call /session/login endpoint
- [x] Add loading state with disabled button
- [x] Add error message display
- [x] Add successful redirect to /home
- [x] Integrate with SessionContext for session storage
- [x] Add "Don't have an account? Sign up here" link
- [x] Add link navigation to /register
- [x] Style with CodeBloggs branding (purple, gradients, shadows)
- [x] Add footer with matching brand color
- [x] Test with valid credentials
- [x] Test with invalid credentials
- [x] Test with missing fields
- [x] Test password show/hide toggle
- [x] Test registration link navigation
- [x] Verify session persists after page refresh
- [x] Check responsive design on mobile
- [ ] Deploy to dev branch

---

## 🔗 Related Features

- Registration Page (accessible via signup link)
- Session Management (SessionContext provides login method)
- Layout Structure (Login page independent, no header/sidebar)
- Home Page (destination after successful login)

---

## 📌 Notes

- Login endpoint returns generic error message to prevent email enumeration attacks
- Payment API error messages should not reveal if email is registered
- Session token stored in localStorage (not httpOnly cookie for SPA simplicity)
- Password hashed server-side with bcrypt (not transmitted in plain text over HTTPS)
- All form inputs trimmed of whitespace before validation
- Eye icon uses emoji for simplicity (👁️ and 👁️‍🗨️)
- Loading state duration: ~1-2 seconds (depends on network)
