🤖 AI_FEATURE_Blogs Section

---

## Feature Identity

- **Feature Name:** Blogs Section
- **Related Area:** Frontend / Pages

---

## Feature Goal

Display a community feed of all posts from all users, sorted by most recent first. Users can discover content from other community members, view engagement metrics (likes and comments), and interact with posts through likes.

---

## Feature Scope

### In Scope (Included)

- Blogs page displaying all posts from all users
- Posts sorted by creation date (newest first)
- Each post displays content text and creation date
- Each post displays the author's initials in a styled avatar
- Like button (thumbs up icon) for each post
- Like count display for each post
- Comments list under each post
- Comments display commenter name, text, and date
- Visual separation between posts
- Loading state while fetching posts
- Empty state message if no posts exist
- Uses Color Palette for styling
- Author information (initials) helps identify post creator

### Out of Scope (Excluded)

- Post filtering or search
- Post categories or tags
- Post sharing functionality
- User profile links from posts
- Following/unfollowing users
- Personalized feed algorithms
- Real-time post updates
- Post editing or deletion
- Comment nested replies
- User reputation or badges

---

## Sub-Requirements (Feature Breakdown)

- Blogs page is accessible from navbar
- All posts from all users are fetched and displayed
- Posts are sorted in descending order (newest first)
- Each post displays its content/message text
- Each post displays its creation date
- Each post displays author's initials in a styled avatar
- Author initials are generated from user's first and last name
- Click on author initials (optional) or shows user info
- Each post displays like count and thumbs up button
- Clicking like sends POST /posts/:postId/like request
- Like count updates immediately after clicking
- Comments list displays under each post
- Comments display commenter's name
- Comments display comment text
- Comments display comment creation date
- Correct comments are associated with correct posts
- If no posts exist, display "No posts yet" message
- If no comments on a post, display "No comments" or empty state
- Page shows loading spinner while fetching posts
- Page handles errors gracefully (display error message)
- Post layout matches Home page design for consistency

---

## User Flow / Logic (High Level)

1. **User Navigates to Blogs Page:**
   - Click "Bloggs" link in navbar
   - Page loads with /bloggs route
   - Bloggs link is highlighted in navbar
   - Loading spinner displays while fetching posts

2. **Posts Feed Loads:**
   - Fetch all posts using GET /posts endpoint
   - For each post, fetch author info to get first/last name for initials
   - Display posts in newest-first order
   - For each post:
     - Display author initials in styled avatar
     - Display post content
     - Display post date
     - Display like count and button
     - Display comments list below post

3. **User Views Author Initials:**
   - See initials in a circle (e.g., "JD" for John Doe)
   - Initials help identify who created the post

4. **User Likes a Post:**
   - Click thumbs up icon
   - Send POST /posts/:postId/like request
   - Like count increments by 1
   - Visual feedback on button

5. **User Views Comments:**
   - Comments already displayed under each post
   - See commenter's name, comment text, and date
   - Multiple comments shown in chronological order

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- Bloggs.jsx — Main blogs page component
- PostFeed.jsx — Container for post list
- PostCard.jsx — Individual post component (can reuse from Home)
- CommentList.jsx — List of comments (can reuse from Home)
- CommentItem.jsx — Individual comment (can reuse from Home)
- Avatar.jsx — Author initials avatar (can reuse from Home)

**Page Layout:**
```
┌──────────────────────────────────────┐
│           HEADER                     │
├─────────┬──────────────────────────┤
│  NAV    │    BLOGS PAGE            │
│ Blogs▼  ├──────────────────────────┤
│         │   POST 1 (newest)        │
│         │   ┌──────┐               │
│         │   │ JD   │  Post content │
│         │   └──────┘  Feb 9, 2026  │
│         │            ❤️ 5         │
│         │            Comments:    │
│         │            - Jane: Nice  │
│         │            - Bob: Good   │
│         │                          │
│         │   POST 2                 │
│         │   ┌──────┐               │
│         │   │ AB   │  Post content │
│         │   └──────┘  Feb 8, 2026  │
│         │            ❤️ 3         │
│         │            Comments:    │
│         │            - Sam: Great  │
│         │                          │
│         │   POST 3 (oldest)        │
│         │   [similar]              │
│         │                          │
│         └──────────────────────────┘
```

### Backend / API

- `GET /posts` — Fetch all posts from all users
  - Input: none (optional: pagination parameters)
  - Output: `[ { post_id, user_id, content, createdAt, likes, comments: [...] }, ... ]`
  - Status: 200 success, includes author info (first_name, last_name)

- `POST /posts/:postId/like` — Like a post
  - Input: `postId`
  - Output: `{ post_id, likes: count }`
  - Status: 200 success

---

## Data Used or Modified

**Posts Data:**
- Array of posts from all users:
  - `post_id` (ObjectId)
  - `user_id` (ObjectId)
  - `first_name` (string, author's first name)
  - `last_name` (string, author's last name)
  - `content` (string, post message)
  - `createdAt` (date, post creation date)
  - `likes` (number, like count)
  - `comments` (array of comments)

**Comments Data:**
- Array of comments for each post:
  - `comment_id` (ObjectId)
  - `user_id` (ObjectId)
  - `content` (string, comment text)
  - `createdAt` (date, comment creation date)
  - `user_name` (string, commenter's name)

**Avatar Generation:**
- Extract first letter of first_name + first letter of last_name
- Example: "Jane Doe" → "JD"

**Sorting:**
- Posts sorted by `createdAt` in descending order (newest first)

---

## Tech Constraints (Feature-Level)

- Use React component (Bloggs.jsx) for page
- Use `useEffect()` to fetch posts on page load
- Use `useState()` to manage posts list and loading state
- Use Fetch API for GET /posts and POST like requests
- Generate author initials from user's first and last name
- Style avatar using CSS (circle background, centered text)
- Format dates consistently (match Home page format)
- Update like count immediately (optimistic updates)
- All colors must conform to Color Palette
- Can reuse PostCard and CommentList components from Home feature
- Handle loading states (display spinner while fetching)
- Handle empty states (display "No posts yet")
- Handle error states (display error message)

---

## Acceptance Criteria

- [ ] Blogs page displays for authenticated users
- [ ] "Bloggs" link is visible in navbar
- [ ] Clicking "Bloggs" navigates to /bloggs page
- [ ] "Bloggs" link is highlighted in navbar when on page
- [ ] Loading spinner displays while posts are fetching
- [ ] All posts from all users are fetched and displayed
- [ ] Posts are displayed in newest-first order
- [ ] Each post displays its content/message text
- [ ] Each post displays its creation date
- [ ] Each post displays author's initials in styled avatar
- [ ] Author initials are correct (first letter of first name + last letter of last name)
- [ ] Avatar styling is consistent (circle background with centered initials)
- [ ] Each post displays like count
- [ ] Each post displays thumbs up like button
- [ ] Clicking like button sends POST request
- [ ] Like count increments by 1 after clicking
- [ ] Comments list displays under each post
- [ ] Commenter's name displays with each comment
- [ ] Comment text content displays correctly
- [ ] Comment date displays with each comment
- [ ] Comments are associated with correct posts
- [ ] "No posts yet" displays if no posts exist
- [ ] "No comments" displays if post has no comments
- [ ] Multiple comments display in chronological order
- [ ] Post layout matches Home page design
- [ ] Error message displays if fetch fails
- [ ] Page handles network errors gracefully
- [ ] No console errors or warnings
- [ ] Page is responsive to different screen sizes (desktop)

---

## Notes for the AI

- Fetch all posts on component mount (useEffect with empty dependency array)
- Use GET /posts endpoint (not /posts/user/:id which is only for current user's posts)
- Include author info (first_name, last_name) in the posts response from backend
- Generate initials: `${firstName[0]}${lastName[0]}`.toUpperCase()
- Style avatar as circle: `border-radius: 50%; width: 80px; height: 80px;`
- Consider pagination if many posts exist (100+)
- Update like count immediately without waiting for response (optimistic update)
- Handle like request errors by reverting the count in state
- Reuse components from Home feature (PostCard, CommentList, Avatar) for consistency
- Format dates to match Home page (e.g., "Feb 9, 2026")
- Display posts in reverse chronological order (sort by createdAt descending)
- Consider infinite scroll or load more button for many posts
- Use loading state: `const [loading, setLoading] = useState(true);`
- Use error state: `const [error, setError] = useState(null);`
- Display conditional messages based on state
- Comments should be fetched as part of posts response
- The backend should return posts with all necessary user info (don't make separate user requests)
