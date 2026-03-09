🤖 AI_FEATURE_Post Modal

---

## Feature Identity

- **Feature Name:** Post Modal
- **Related Area:** Frontend / UI Component

---

## Feature Goal

Provide a global modal overlay that allows logged-in users to create and submit new posts from any page within the application. The modal should be easily accessible via the Post button in the header and dismissible by clicking outside the modal.

---

## Feature Scope

### In Scope (Included)

- Post Modal overlay (modal window on top of page content)
- Modal available on all authenticated pages (Home, Bloggs, Network, Admin)
- Post button in header triggers modal visibility
- Text input field for post content
- Submit button to create post
- Modal closes when user clicks outside the modal
- Modal closes after successful post submission
- Modal closes when user clicks a close button (X)
- Loading state while post is being submitted
- Error handling if post submission fails
- Success message or notification after post creation
- Modal background dims page behind it
- Uses Color Palette for styling

### Out of Scope (Excluded)

- Post image/file upload
- Post scheduling or draft functionality
- Post preview before submission
- Post editing (only create new posts)
- Character count or length limit alerts (optional)
- Rich text editor (plain text only)
- Post hashtags or mentions
- Post privacy/visibility settings

---

## Sub-Requirements (Feature Breakdown)

- Post Modal is hidden by default
- Clicking "Post" button in header opens/shows the modal
- Modal displays as an overlay above current page content
- Modal contains a text input field for post content
- Modal contains a "Submit" button to create the post
- Modal contains a "Close" or "X" button to dismiss
- Modal closes when user clicks anywhere outside the modal (overlay click)
- Modal closes when user clicks the close/X button
- Modal closes after successful post submission
- Clicking close button does not submit the post
- Modal prevents user from interacting with page behind it (disabled)
- Modal shows loading spinner while POST /posts request is pending
- Modal displays error message if post submission fails
- Modal shows success message or toast after successful submission
- Modal can be reopened after closing (not destroyed, just hidden)
- Modal styling matches application design
- Modal uses colors from Color Palette
- All form inputs are cleared after successful submission or modal close

---

## User Flow / Logic (High Level)

1. **User is on Any Authenticated Page:**
   - User sees "Post" button in header
   - Modal is hidden by default

2. **User Clicks Post Button:**
   - Modal overlay appears
   - Background content dims/blurs
   - Modal is focused (user can type immediately)
   - Modal contains empty text input field
   - Submit and close buttons are visible

3. **User Types Post Content:**
   - User clicks in text field
   - User types post message
   - Submit button remains enabled

4. **User Submits Post:**
   - User clicks "Submit" button
   - Loading spinner displays
   - POST /posts request is sent
   - Backend creates new post in database

5. **Successful Submission:**
   - Loading spinner disappears
   - Success message displays (brief, auto-hides)
   - Modal closes automatically
   - User returns to current page
   - New post appears in feeds (if on Bloggs or Home)

6. **Failed Submission:**
   - Loading spinner disappears
   - Error message displays
   - Modal stays open
   - User can retry or close modal

7. **User Closes Modal (without submitting):**
   - User clicks outside modal
   - Or clicks close/X button
   - Modal closes
   - Page content returns to normal
   - Text input is cleared

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- Header.jsx — Contains Post button
- PostModal.jsx — Modal component
- Overlay/Backdrop component — Dims background

**Modal Layout:**
```
┌─────────────────────────────────────────┐
│  ✕ Create a Post                        │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ What's on your mind?              │  │
│  │                                   │  │
│  │ [User types post content here]    │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  [Submit]    │  │  [Close]     │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
└─────────────────────────────────────────┘
(click outside to close)
```

**Modal States:**
- Closed (hidden, display: none)
- Open (visible, overlay shows)
- Loading (submit button disabled, spinner shows)
- Error (error message displays)
- Success (success message displays briefly)

### Backend / API

- `POST /posts` — Create a new post
  - Input: `user_id`, `content`
  - Output: `{ post_id, user_id, content, createdAt, likes: 0, comments: [] }`
  - Status: 201 created, 400 bad request, 401 unauthorized

---

## Data Used or Modified

**Input Data (from user):**
- `content` (string, post message/text)
- `user_id` (from session, sent with request)
- `timestamp` (auto-generated by backend)

**Form Validation:**
- Content must not be empty
- Content should have reasonable length (optional max: 500-1000 chars)

**Modal State Variables:**
- `modalOpen` (boolean, modal visibility)
- `postContent` (string, current input value)
- `isLoading` (boolean, loading state during submission)
- `error` (string or null, error message)
- `success` (string or null, success message)

**API Response Data:**
- Returns new post object if successful
- Returns error message if failed

---

## Tech Constraints (Feature-Level)

- Use React state (useState) to manage modal visibility
- Use Context API or prop drilling to pass modal state to Header component
- Modal should be controlled component (state-based visibility)
- Use Fetch API for POST /posts request
- Validate input before submission (client-side)
- Send POST request asynchronously (async/await or .then())
- Use loading state to disable submit button while pending
- Handle errors gracefully (display error message)
- Use optional: toast library or custom notification for success message
- Modal overlay should prevent background scroll or interaction
- Use CSS modal styling: position fixed, z-index high, backdrop blur/dim
- All colors must conform to Color Palette
- Modal should be accessible: keyboard navigation (Tab, Escape to close)

---

## Acceptance Criteria

- [ ] Post button is visible in header on all authenticated pages
- [ ] Clicking Post button opens the modal
- [ ] Modal displays as an overlay above page content
- [ ] Modal contains text input field for post content
- [ ] Modal contains Submit button
- [ ] Modal contains Close/X button
- [ ] Text input field is focused when modal opens
- [ ] Typing in input field updates the text
- [ ] Clicking outside modal closes the modal
- [ ] Clicking close/X button closes the modal
- [ ] Modal prevents interaction with page behind it
- [ ] Submitting empty post shows error or prevents submission
- [ ] Clicking Submit sends POST /posts request
- [ ] Loading spinner displays while request is pending
- [ ] Submit button is disabled while loading
- [ ] Successful submission closes modal automatically
- [ ] Success message displays briefly after submission
- [ ] Modal text is cleared after successful submission
- [ ] New post appears in feeds after submission (if applicable)
- [ ] Failed submission keeps modal open
- [ ] Error message displays for failed submission
- [ ] User can retry submission after error
- [ ] Modal closes without submitting on close button click
- [ ] Modal text is cleared when modal closes
- [ ] Modal can be reopened multiple times
- [ ] Modal styling uses Color Palette colors
- [ ] Modal background dims/blurs appropriately
- [ ] No console errors or warnings
- [ ] Pressing Escape key closes modal (optional accessibility)
- [ ] Tab key navigation works within modal (optional accessibility)

---

## Notes for the AI

- Create a custom hook `usePostModal()` to manage modal state (open/close) or use Context API
- Consider using React Context (`PostModalContext`) to share modal state across components
- Modal component should be placed in a layout wrapper or portal (ReactDOM.createPortal) at top level
- Use `useCallback` to prevent unnecessary re-renders of modal
- Handle click outside by attaching click listener to overlay/backdrop
- Use ref to detect clicks inside modal vs outside: `if (!modalRef.current.contains(event.target)) close()`
- Or use a library like `react-modal` or custom implementation
- Clear input field when modal closes: `setPostContent('')`
- Validate content before submission: `if (!postContent.trim()) return;`
- Show error if content is empty: "Please enter some content"
- Handle long submissions gracefully (optional max length validation)
- Send user_id with POST request (from session storage or context)
- Use optimistic update: show new post immediately, then confirm with backend response
- Or wait for response before updating feeds (choose one approach)
- Use loading state to provide user feedback: `isLoading ? "Posting..." : "Submit"`
- Handle fetch errors: network error, server error, validation error
- Display user-friendly error messages (not technical errors)
- Success message can be: "Post created!" or "Post shared!"
- Consider auto-hide success message after 2-3 seconds
- Focus trap (optional): keep keyboard focus within modal while open
- Prevent body scroll when modal is open: `document.body.style.overflow = 'hidden'`
- Restore scroll on close: `document.body.style.overflow = 'auto'`
- Modal should have high z-index (e.g., z-index: 1000) to appear above all content
- Backdrop should have slightly lower z-index (e.g., z-index: 999)
- Use CSS transitions for smooth modal open/close animations (optional)
- Test that modal doesn't block critical UI elements when open
- Ensure modal is centered on screen or positioned appropriately
- Consider mobile responsiveness (even though desktop-only, structure for future)
- If using React Portal, render modal outside main app div in index.html for proper stacking
