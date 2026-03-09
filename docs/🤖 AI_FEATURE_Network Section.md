🤖 AI_FEATURE_Network Section

---

## Feature Identity

- **Feature Name:** Network Section
- **Related Area:** Frontend / Pages

---

## Feature Goal

Display a directory of all users in the community as individual user cards. Each card shows key user information and their latest post, helping users discover and connect with other community members.

---

## Feature Scope

### In Scope (Included)

- Network page displaying all users as user cards
- Grid or list layout of user cards
- Each user card displays user information
- Each user card displays user's stylized initials avatar
- User name (first name + last name)
- User occupation and location
- User's latest post (if posts exist)
- Latest post content preview
- Latest post date
- Visual separation and styling for cards
- Uses Color Palette for styling
- Loading state while fetching users
- Empty state message if no users exist

### Out of Scope (Excluded)

- User profile pages (clickable user names)
- Following/unfollowing users
- User search or filtering
- User sorting or pagination (basic list only)
- Direct messaging or user contact info
- User follow counts or activity stats
- User bio or description fields
- Profile picture upload
- Block or mute users

---

## Sub-Requirements (Feature Breakdown)

- Network page is accessible from navbar
- All users from database are fetched and displayed
- Each user displays a styled avatar with initials
- User initials are generated from first and last name
- Each user displays their full name (first name + last name)
- Each user displays their occupation
- Each user displays their location
- Each user's latest post is fetched and displayed
- Latest post content (text preview) displays on card
- Latest post date displays on card
- If user has no posts, display "No posts yet" or empty state
- User cards are visually distinct from each other
- Card layout is consistent across all users
- Cards use consistent spacing and sizing
- Page shows loading spinner while fetching users
- Page handles errors gracefully
- Empty state displays if no users exist (unlikely but handle it)

---

## User Flow / Logic (High Level)

1. **User Navigates to Network Page:**
   - Click "Network" link in navbar
   - Page loads with /network route
   - Network link is highlighted in navbar
   - Loading spinner displays while fetching data

2. **Users List Loads:**
   - Fetch all users using GET /users endpoint
   - For each user, fetch their latest post
   - Display users in a grid or list layout
   - For each user card:
     - Display user initials in styled avatar
     - Display user's full name
     - Display user's occupation
     - Display user's location
     - Display their latest post (if exists)

3. **View User Cards:**
   - See all community members in one view
   - Understand what other users are posting about
   - Discover content from different users

4. **Discover User's Latest Post:**
   - User card shows their most recent post
   - Can see what they're currently sharing with community

---

## Interfaces (Pages, Endpoints, Screens)

### Frontend

**Components:**
- Network.jsx — Main network page component
- UserCardList.jsx — Container for user cards
- UserCard.jsx — Individual user card component
- Avatar.jsx — User initials avatar (reuse from Home)

**Page Layout:**
```
┌──────────────────────────────────────┐
│           HEADER                     │
├─────────┬──────────────────────────┤
│  NAV    │    NETWORK PAGE          │
│Network▼ ├──────────────────────────┤
│         │  ┌─────────────────┬─ ... │
│         │  │ ┌──────┐        │      │
│         │  │ │ JD   │ John D │      │
│         │  │ └──────┘        │      │
│         │  │ Developer       │      │
│         │  │ San Francisco   │      │
│         │  │                 │      │
│         │  │ Latest post:    │      │
│         │  │ "Just learned..." │     │
│         │  │ Feb 9, 2026     │      │
│         │  └─────────────────┘      │
│         │                          │
│         │  ┌─────────────────┬─ ... │
│         │  │ ┌──────┐        │      │
│         │  │ │ AB   │ Alice B │     │
│         │  │ └──────┘        │      │
│         │  │ Designer        │      │
│         │  │ New York        │      │
│         │  │                 │      │
│         │  │ Latest post:    │      │
│         │  │ "Working on..." │      │
│         │  │ Feb 8, 2026     │      │
│         │  └─────────────────┘      │
│         │                          │
│         │  [more cards]            │
│         │                          │
│         └──────────────────────────┘
```

**Card Layout (Single User Card):**
```
┌──────────────────┐
│  ┌──────┐        │
│  │ JD   │ John D │
│  └──────┘ Doe    │
│                  │
│  Developer       │
│  SF, CA          │
│                  │
│  Latest Post:    │
│  "Just learned..." │
│  Feb 9, 2026     │
└──────────────────┘
```

### Backend / API

- `GET /users` — Fetch all users
  - Input: none
  - Output: `[ { user_id, first_name, last_name, occupation, location }, ... ]`
  - Status: 200 success

- `GET /posts/user/:id` — Fetch user's posts (to get latest)
  - Input: `user_id`
  - Output: `[ { post_id, content, createdAt }, ... ]` (sorted by date, newest first)
  - Status: 200 success, returns empty array if no posts

---

## Data Used or Modified

**Users Data:**
- Array of all users:
  - `user_id` (ObjectId)
  - `first_name` (string)
  - `last_name` (string)
  - `occupation` (string)
  - `location` (string)

**Latest Post Data (per user):**
- Most recent post for each user:
  - `post_id` (ObjectId)
  - `content` (string, post message, may be truncated for preview)
  - `createdAt` (date, post creation date)

**Avatar Generation:**
- Extract: `${first_name[0]}${last_name[0]}`.toUpperCase()
- Example: "John Doe" → "JD"

---

## Tech Constraints (Feature-Level)

- Use React component (Network.jsx) for page
- Use `useEffect()` to fetch users on page load
- Use `useState()` to manage users list and loading state
- Use Fetch API for GET requests
- Generate user initials from first and last name
- Style avatar as circle background with centered initials
- Format dates consistently (match Home page format)
- Cards can use CSS Grid (responsive) or flexbox layout
- All colors must conform to Color Palette
- Reuse Avatar component from Home feature
- Handle loading states (display spinner)
- Handle empty states (display "No users" message)
- Handle error states (display error message)

---

## Acceptance Criteria

- [ ] Network page displays for authenticated users
- [ ] "Network" link is visible in navbar
- [ ] Clicking "Network" navigates to /network page
- [ ] "Network" link is highlighted in navbar when on page
- [ ] Loading spinner displays while users are fetching
- [ ] All users from database are fetched
- [ ] User count matches database count
- [ ] Each user card is displayed distinctly
- [ ] Each user displays their initials in a styled avatar
- [ ] User initials are correct (first letter of first name + first letter of last name)
- [ ] Avatar styling is consistent (circle background)
- [ ] Each user displays their full name (first_name + last_name)
- [ ] Each user displays their occupation
- [ ] Each user displays their location
- [ ] User's latest post is displayed on card (if exists)
- [ ] Latest post content displays as preview
- [ ] Latest post date displays correctly
- [ ] "No posts yet" displays if user has no posts
- [ ] User cards are visually separated (spacing, borders, background)
- [ ] Card layout is consistent across all cards
- [ ] Cards use Color Palette colors appropriately
- [ ] Empty state displays if no users exist (unlikely)
- [ ] Error message displays if fetch fails
- [ ] Page handles network errors gracefully
- [ ] No console errors or warnings
- [ ] Page layout is responsive to different screen sizes (desktop)

---

## Notes for the AI

- Fetch all users on component mount (useEffect with empty dependency array)
- Make two types of requests: GET /users (all users) and then for each user GET /posts/user/:id
- Alternatively, backend could return latest post data with user data in single response (more efficient)
- Generate initials: `${firstName[0]}${lastName[0]}`.toUpperCase()
- Style avatar as circle: `border-radius: 50%; width: 80px; height: 80px;`
- Consider using CSS Grid for responsive card layout: `display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));`
- Or use fixed grid: `grid-template-columns: repeat(3, 1fr);` for 3 columns
- Reuse Avatar component from Home feature for consistency
- Format dates to match Home page (e.g., "Feb 9, 2026")
- Truncate post content if too long: `content.substring(0, 100) + "..."`
- Use loading state: `const [loading, setLoading] = useState(true);`
- Use error state: `const [error, setError] = useState(null);`
- Make requests to GET /posts/user/:userId for latest post (should include user_id in path)
- Consider pagination if many users exist (1000+)
- Sort users by first name or join date (design choice)
- The latest post should be the most recent one (sorted by createdAt descending)
- Consider caching user data if not changing frequently
- If backend can return latest post with user data, do that to reduce requests
- Card styling should include subtle shadow or border for visual separation
- Use consistent card spacing (gaps between columns and rows)
