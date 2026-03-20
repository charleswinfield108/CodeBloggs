# Skeleton Loaders, Pagination & Admin Managers

## Quick Overview
This document explains three core features in the CodeBloggs client:
1. **Skeleton Loaders** - Loading state UI
2. **Pagination** - Data chunking & navigation
3. **Manager Pages** - User and Content management interfaces

---

## 1. Skeleton Loaders ⚡

### What Are They?
Placeholder UI components that display while data loads from the backend.

### Key Features
- Uses CSS `pulse` animation (fade in/out over 2 seconds)
- Three types: **post**, **card**, **user**
- Minimum 400ms display time (prevents flickering on fast networks)

### Implementation
```javascript
const skeletonStyle = {
  backgroundColor: "#D3D3D3",
  borderRadius: "6px",
  animation: "pulse 2s ease-in-out infinite",
};
```

### Structure by Type
| Type | Layout | Shows |
|------|--------|-------|
| **post** | 2-column (20% author / 80% content) | Avatar, name, date, 3 content lines, buttons |
| **card** | Vertical stack | Avatar, name, role, bio, button |
| **user** | Table row | 6 columns matching table structure |

### Smart Timing Logic
```javascript
// Ensures users see skeleton for at least 400ms
const elapsedTime = Date.now() - startTime;
const remainingDelay = Math.max(0, 400 - elapsedTime);
setTimeout(() => setLoading(false), remainingDelay);
```

---

## 2. Pagination 📄

### Core Formula
```javascript
// Calculate which items to show
const skip = (page - 1) * itemsPerPage;
const paginatedItems = allItems.slice(skip, skip + itemsPerPage);
const totalPages = Math.ceil(total / itemsPerPage);
```

### User Manager Pagination
- **Default**: 10 per page
- **Options**: 5, 10, 15, 25
- **Server-side**: Backend filters by firstName/lastName before returning
- **Reset behavior**: Resets to page 1 when page size changes

### Content Manager Pagination
- **Default**: 10 per page
- **Options**: 10, 25, 50
- **Client-side**: All posts fetched, then filtered/sorted locally
- **Sorting**: Newest first (by createdAt descending)

### UI Controls
- **Previous/Next** buttons (auto-disabled at boundaries)
- **Page numbers** (shows current page highlighted)
- **Results dropdown** (change items per page)
- **Page info** display (e.g., "Page 2 of 5")

---

## 3. User Manager 👥

### Purpose
Admin-only page for managing all system users

### Core States
```javascript
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [totalUsers, setTotalUsers] = useState(0);
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [sortBy, setSortBy] = useState(null); // 'first_name' | 'last_name'
const [sortOrder, setSortOrder] = useState("asc"); // 'asc' | 'desc'
```

### Key Features
✅ **Search** - Filter by first name and/or last name (AND logic)  
✅ **Sort** - Click headers to toggle ascending/descending  
✅ **Edit** - Navigate to user update page  
✅ **Delete** - With confirmation modal  
✅ **Responsive** - Mobile and desktop layouts  
✅ **Responsive** - Adapts based on window size  

### Data Flow
```
Input search → Fetch /users?page=X&limit=10&firstName=John&lastName=Doe
            → Receive { users: [...], total: number }
            → Apply client-side sorting
            → Display paginated results + skeleton loaders
```

### User Interactions
1. Type in search box → Auto-filters by firstName/lastName
2. Click column header → Toggle sort order
3. Click "Edit" → Navigate to `/admin/users/{userId}`
4. Click "Delete" → Confirmation modal → Refresh list
5. Select items per page → Reset to page 1, reload

### Access Control
- **Admin only** - Redirects non-admins to /home
- Uses `SessionContext` to verify auth_level

---

## 4. Content Manager 📝

### Purpose
Admin-only page for moderating all posts in the system

### Core States
```javascript
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [totalPosts, setTotalPosts] = useState(0);
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
```

### Key Features
✅ **Date Filtering** - Search by creation date range  
✅ **Auto Sort** - Newest posts first (by createdAt)  
✅ **Edit** - View/modify post details  
✅ **Delete** - With confirmation modal  
✅ **Author Names** - Fetches user map for display  
✅ **Responsive** - Mobile and desktop layouts  

### Data Flow
```
Fetch /posts
    → Filter by date range (all client-side)
    → Sort by createdAt descending
    → Paginate: slice(skip, skip + size)
    → Fetch /users?limit=1000 for author info
    → Build userMap { userId → userData }
    → Display paginated posts with author names
```

### Date Filtering Logic
```javascript
// Inclusive filtering
if (start && postDate < start) return false;
if (end) {
  const endOfDay = new Date(end);
  endOfDay.setHours(23, 59, 59, 999);
  if (postDate > endOfDay) return false;
}
return true;
```

### User Interactions
1. Select start/end date → Applies filter → Page resets to 1
2. Click "Select All" → Clears filters → Shows all posts
3. Click "Clear" → Clears UI without refetching
4. Click "Edit" → View post details
5. Click "Delete" → Confirmation modal → Refresh list
6. Select items per page → Reset to page 1, reload

### Access Control
- **Admin only** - Redirects non-admins to /home
- Uses `SessionContext` to verify auth_level

---

## 5. Key Differences 🔄

| Aspect | User Manager | Content Manager |
|--------|-------------|-----------------|
| **Filtering** | Server-side (firstName, lastName) | Client-side (date range) |
| **Sorting** | Server + client combined | Client-side only (newest first) |
| **Pagination** | Server-aware (limit/page params) | Client-side slicing |
| **Initial Load** | Paginated response | Full data fetched then paginated |
| **Related Data** | N/A | Fetches user map for authors |

---

## 6. Common UX Patterns 🎨

### Shared Patterns
- ✅ Skeleton loaders show during fetch
- ✅ Minimum 400ms display prevents flicker
- ✅ Sticky headers stay visible while scrolling
- ✅ Button hover effects with color transitions
- ✅ Toast notifications for success/error
- ✅ Confirmation modals for destructive actions
- ✅ Disabled buttons at pagination boundaries
- ✅ Responsive mobile/desktop layouts

### Loading Experience
1. User action triggers fetch
2. Loading state set to true
3. Skeleton loaders appear
4. Data arrives (may be instant)
5. Skeleton displays minimum 400ms
6. Real data fades in
7. Loading state set to false

---

## Summary 🎯

| Component | Purpose | Admin Only | Type |
|-----------|---------|-----------|------|
| **Skeleton Loader** | Loading state display | — | Reusable |
| **User Manager** | Manage all system users | ✅ Yes | Page |
| **Content Manager** | Moderate all posts | ✅ Yes | Page |
| **Pagination** | Split data into pages | — | Pattern |

**Key Takeaway**: These features work together to provide a smooth, professional admin experience—from perceived performance during loading, to efficient data browsing across multiple pages, to safe content management with confirmation flows.
