🤖 AI_FEATURE_Home Section

---

## Feature Identity

- **Feature Name:** Home Section
- **Related Area:** Frontend / Pages

---

## Feature Goal

Display a personalized dashboard for authenticated users showing their profile information, a summary of their posts, and a chronological list of their posts with engagement features (likes and comments). The Home page serves as the user's primary entry point after login.

---

## Feature Scope

### In Scope (Included)

- User Profile Section with stylized initials avatar (no image upload)
- User name display (first name + last name)
- User personal information (email, location, occupation, birthdate)
- Total post count (calculated from user's posts)
- Date of last post (calculated from user's posts)
- List of user's posts displayed below profile
- Each post displays content/message text
- Each post displays creation date below message
- Like button (thumbs up icon) for each post
- Like count display for each post
- Click to like functionality with count update
- Comments list under each post
- Comments display commenter name, comment text, and date
- Posts sorted by most recent first
- Visual separation between posts
- Uses Color Palette for styling
- Responsive layout for profile and post sections

### Out of Scope (Excluded)

- Profile picture upload or selection
- User profile editing or settings
- Post editing or deletion
- Comment deletion or editing
- Liking comments
- Post search or filtering
- Post sharing to social media
- Real-time comment updates
- Comment nested replies
- User follow/unfollow functionality

---

## Sub-Requirements (Feature Breakdown)

- Profile section displays user initials in a stylized graphic (circle with initials)
- User's first and last name displayed in profile
- User's email displayed in profile
- User's birthdate displayed in profile
- User's occupation displayed in profile
- User's location displayed in profile
- Total post count is calculated and displayed (number of posts)
- Last post date is calculated and displayed (most recent post date)
- Posts are fetched from backend using GET /posts/user/:id endpoint
- Posts are displayed in descending order (newest first)
- Each post displays the post content/message text
- Each post displays the date/timestamp below the message
- Each post has a thumbs up icon button for liking
- Clicking thumbs up sends POST /posts/:postId/like request
- Like count updates immediately after clicking like
- Each post displays the current number of likes
- Comments list is displayed under each post
- Comments display commenter's name
- Comments display comment text content
- Comments display comment creation date
- Comments are fetched from backend with posts or via separate endpoint
- If no posts exist, display "No posts yet" message
- If no comments exist on a post, display "No comments" or similar

---

## User Flow / Logic (High Level)

1. **User Navigates to Home Page:**
   - Page loads with /home route
   - Header and Navbar are visible
   - Home link is highlighted in navbar

2. **Profile Section Loads:**
   - Fetch user profile using GET /user/:id endpoint
   - Display user initials in styled avatar (e.g., "JD" for John Doe)
   - Display user's personal information (name, email, birthdate, occupation, location)
   - Calculate and display total post count
   - Calculate and display last post date

3. **Posts List Loads:**
   - Fetch user's posts using GET /posts/user/:id endpoint
   - Display posts in reverse chronological order (newest first)
   - For each post:
     - Show post content/message
     - Show post creation date
     - Show like count and thumbs up button
     - Show list of comments below post

4. **User Likes a Post:**
   - Click thumbs up icon on a post
   - Send POST /posts/:postId/like request
   - Like count updates immediately (+1)
   - Visual feedback (button highlight or animation)

5. **View Comments:**
   - Comments are already displayed below each post
   - Display commenter's name, comment text, and date
   - If no comments, display "No comments" message

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- Home.jsx — Main home page component
- UserProfile.jsx — User profile section with initials avatar
- PostList.jsx — List of user's posts
- PostCard.jsx — Individual post component
- CommentList.jsx — List of comments for a post
- CommentItem.jsx — Individual comment component
- Avatar.jsx (optional) — Initials avatar component

**Page Layout:**
```
┌──────────────────────────────────────┐
│           HEADER                     │
├─────────┬──────────────────────────┤
│  NAV    │    HOME PAGE             │
│         ├──────────────────────────┤
│         │  USER PROFILE SECTION    │
│         │  ┌──────┐                │
│         │  │ JD   │  John Doe      │
│         │  └──────┘  john@...      │
│         │            Occupation    │
│         │            Location      │
│         │  Posts: 5  Last: 2/9/26  │
│         ├──────────────────────────┤
│         │  POST 1                  │
│         │  ┌──────────────────┐    │
│         │  │ Post content...  │    │
│         │  │ Feb 9, 2026      │    │
│         │  │ ❤️ 3            │    │
│         │  │ Comments:        │    │
│         │  │ - Jane: Nice!    │    │
│         │  │ - Bob: Thanks... │    │
│         │  └──────────────────┘    │
│         │                          │
│         │  POST 2                  │
│         │  [similar layout]        │
│         │                          │
│         └──────────────────────────┘
```

### Backend / API

- `GET /user/:id` — Fetch user profile information
  - Input: `id` (user ID from session)
  - Output: `{ first_name, last_name, email, birthdate, occupation, location }`
  - Status: 200 success, 404 user not found

- `GET /posts/user/:id` — Fetch user's posts
  - Input: `id` (user ID)
  - Output: `[ { post_id, content, createdAt, likes, comments: [...] }, ... ]`
  - Status: 200 success, 404 user not found

- `POST /posts/:postId/like` — Like a post
  - Input: `postId` (post ID)
  - Output: `{ post_id, likes: count }`
  - Status: 200 success, 400/404 error

- `GET /posts/:postId/comments` (optional) — Fetch comments for a post
  - Input: `postId`
  - Output: `[ { comment_id, user_id, content, createdAt }, ... ]`
  - Status: 200 success

---

## Data Used or Modified

**Input Data (from session):**
- `user_id` (ObjectId, from session storage)

**User Profile Data:**
- `first_name` (string)
- `last_name` (string)
- `email` (string)
- `birthdate` (date)
- `occupation` (string)
- `location` (string)

**Calculated Fields:**
- `total_posts` (number, count of posts)
- `last_post_date` (date, most recent post date)

**Posts Data:**
- Array of posts with:
  - `post_id` (ObjectId)
  - `content` (string, post message)
  - `createdAt` (date, post creation date)
  - `likes` (number, like count)
  - `likes_array` (array of user IDs who liked, optional)

**Comments Data:**
- Array of comments with:
  - `comment_id` (ObjectId)
  - `user_id` (ObjectId, who commented)
  - `content` (string, comment text)
  - `createdAt` (date, comment creation date)
  - `user_name` (string, name of commenter, optional or fetched separately)

**Avatar Generation:**
- Extract first letter of first_name + first letter of last_name
- Example: "John Doe" → "JD"

---

## Tech Constraints (Feature-Level)

- Use React components for page structure
- Use `useEffect()` to fetch user profile and posts on page load
- Use `useState()` to manage profile data and posts list
- Use Fetch API for GET and POST requests
- Generate initials avatar using JavaScript string manipulation
- Style avatar using CSS (circle background, centered text)
- Parse and format dates using JavaScript Date or date library
- Update like count immediately on frontend (optimistic update)
- Optional: Send like request in background without blocking UI
- Use flexbox or grid for layout
- All colors must conform to Color Palette
- Handle loading states (display spinner while fetching data)
- Handle empty states (no posts, no comments)
- Handle error states (display error message if fetch fails)
- Do not reload page after liking (use state update)

---

## Acceptance Criteria

- [ ] Home page displays for authenticated users
- [ ] User profile section is visible at top of page
- [ ] User initials are displayed in a stylized graphic (circle with initials)
- [ ] User's first and last name are displayed
- [ ] User's email is displayed in profile
- [ ] User's birthdate is displayed in profile
- [ ] User's occupation is displayed in profile
- [ ] User's location is displayed in profile
- [ ] Total post count is calculated correctly
- [ ] Total post count is displayed (e.g., "Posts: 5")
- [ ] Last post date is calculated correctly
- [ ] Last post date is displayed (e.g., "Last: 2/9/26")
- [ ] User's posts are fetched and displayed
- [ ] Posts are displayed in newest-first order
- [ ] Each post displays its content/message text
- [ ] Each post displays its creation date below message
- [ ] Each post has a thumbs up icon
- [ ] Clicking thumbs up sends like request to backend
- [ ] Like count increments by 1 after clicking like
- [ ] Like count displays correctly for each post
- [ ] Comments list displays under each post
- [ ] Commenter's name is displayed for each comment
- [ ] Comment text is displayed for each comment
- [ ] Comment date is displayed for each comment
- [ ] "No posts yet" message displays if user has no posts
- [ ] "No comments" message displays if post has no comments
- [ ] Loading spinner/message displays while data is fetching
- [ ] Error message displays if fetch fails
- [ ] Avatar styling matches design (circle background with centered text)
- [ ] All text uses Navy color (#1F2340)
- [ ] Profile section uses Light Gray or Primary background
- [ ] Posts use Soft Gray or Light Gray background
- [ ] Likes are displayed correctly (no duplication)
- [ ] Comment data matches data from Comment collection
- [ ] No console errors or warnings
- [ ] Page is responsive to different screen sizes (desktop)

---

## Notes for the AI

- Fetch user profile and posts on component mount (useEffect with empty dependency array)
- Extract user_id from session storage or context to make API requests
- Generate initials from user's first and last name: `${first_name[0]}${last_name[0]}`.toUpperCase()
- Style avatar as a circle: `border-radius: 50%; width: 80px; height: 80px;`
- Center initials in avatar using flexbox: `display: flex; align-items: center; justify-content: center;`
- Format dates consistently (e.g., "Feb 9, 2026" or "2/9/2026")
- When user clicks like, update state immediately without waiting for response (optimistic update)
- Consider sending like request with async/await to handle errors
- If like request fails, revert the like count in state
- Comments can be fetched as part of the posts response or via separate endpoint
- Consider pagination if user has many posts (100+)
- Use loading state: `const [loading, setLoading] = useState(true);`
- Use error state: `const [error, setError] = useState(null);`
- Display conditional messages: if (loading) show spinner, if (error) show error, if (posts.length === 0) show "No posts"
- Ensure user_id is sent with like request (backend may need this for authorization)
- Consider adding a check to prevent user from liking the same post twice (optional)
- If using optimistic updates, handle race conditions (multiple quick likes)
- Format birthdate as a readable string (not ISO format)
- The last_post_date should be the createdAt of the most recent post
- Consider using a formatDate() utility function for consistent date formatting
- Comments should display in chronological order (oldest first or newest first - choose one)
- Consider empty state messaging: "Start sharing your thoughts!" instead of "No posts yet"
