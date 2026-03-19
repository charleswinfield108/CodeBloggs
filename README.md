# CodeBloggs

A modern social media platform designed for programmers and developers to share blog posts, comment on each other's content, and connect with the developer community.

---

## 📋 Project Description

**CodeBloggs** is a full-stack web application built with the MERN stack that enables developers to:
- Create and manage their own blog posts
- Browse posts from other developers in the Bloggs section
- Comment on and like posts to engage with the community
- Build a network by viewing user profiles
- Manage user accounts with registration and secure login
- Access admin features for content and user management

Whether you're looking to share your development journey or stay connected with fellow programmers, CodeBloggs provides a dedicated space for the developer community.

---

## ✨ Key Features & Functionality

### User Features
- **User Authentication** - Secure login and registration with email validation
- **Personal Dashboard** - View your profile, posts, and user information
- **Blog Posts** - Create, read, update, and delete blog posts
- **Social Interactions** - Like posts and comment on content from other developers
- **Community Feed** - Browse all blog posts from the developer community
- **Network/Directory** - Discover and connect with other community members
- **User Profiles** - View other users' profiles and post history with permission checks
- **Session Management** - Secure HTTP-only cookies and JWT-based authentication

### Admin Features
- **User Management Dashboard** - Search, filter, paginate, and manage user accounts
  - Edit user details (name, email, occupation, location)
  - Delete user accounts with confirmation
  - Bulk delete operations
- **Content Management Dashboard** - Manage all blog posts in the community
  - Search and filter posts by date
  - Delete inappropriate or spam posts
  - Pagination for large datasets
- **Admin Dashboard** - Central control panel for all administrative operations

### UX/Design Features
- **Toast Notifications** - Real-time feedback with success, error, warning, and info messages
- **Confirmation Modals** - Safety confirmations for critical operations (delete, update)
- **Skeleton Loaders** - Loading placeholders for better perceived performance
- **User Avatars** - Consistent circular avatars with user initials
- **Responsive Design** - Mobile-first approach optimized for all devices
- **Google Places Integration** - Autocomplete suggestions for location during registration

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **Vite** 7.3.1 - Fast build tool and development server
- **Tailwind CSS** 4.2.1 - Utility-first CSS framework
- **React Router DOM** 7.13.1 - Client-side routing
- **React Icons** 5.6.0 - Icon library
- **PostCSS** 8.5.8 - CSS processing
- **ESLint** 9.39.1 - Code quality linting

### Backend
- **Node.js** - JavaScript runtime
- **Express** 4.18.2 - Web framework
- **MongoDB** 4.17.1 - NoSQL database
- **Mongoose** 8.0.0 - MongoDB object modeling
- **Bcrypt** 5.1.1 - Password hashing
- **JSONWebToken** 9.0.2 - JWT authentication
- **Express Session** 1.17.3 - Session management
- **CORS** 2.8.5 - Cross-Origin Resource Sharing
- **Nodemon** 3.0.1 - Development auto-reload
- **Cookie Parser** 1.4.6 - Cookie parsing middleware

---

## 🚀 Installation & Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **MongoDB** (local or MongoDB Atlas connection)
- **Git**

### Step 1: Clone or Download the Project
```bash
cd /path/to/CodeBloggs
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../client
npm install
```

### Step 4: Configure Environment Variables
Create a `.env` file in the `server` directory with the following configuration:
```
PORT=5050
JWT_SECRET=your-secret-key-here
MONGODB_URI=mongodb://localhost:27017/codebloggs
NODE_ENV=development
```

See the [Environment Variables](#-environment-variables) section below for details on each variable.

### Step 5: Start the Backend Server
```bash
cd server
npm start
```
The server will run on `http://localhost:5050`

### Step 6: Start the Frontend Development Server (in a new terminal)
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:5173` (or the next available port)

### Step 7: Access the Application
Open your browser and navigate to `http://localhost:5173` to view the application.

---

## 🔐 Environment Variables

The application requires the following environment variables to be configured in the `server/.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port number for the Express server | `5050` |
| `JWT_SECRET` | Secret key for JWT token signing (use a strong random string) | `your-super-secret-key-change-me` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/codebloggs` |
| `NODE_ENV` | Application environment | `development` or `production` |

**⚠️ Important:** Never commit the `.env` file to version control. The `.env` file contains sensitive information and should be kept private.

---

## 🎯 Getting Started Guide

### For New Users
1. **Create Account** - Visit the Registration page and fill in your details
   - Your location will autocomplete using Google Places
   - Username = First Name + Last Name (auto-generated from registration data)
2. **Explore the Community** - Browse the Blogs section to see what others are posting
3. **Network** - Visit the Network page to discover other developers
4. **Create Posts** - Click the "+ Post" button to share your thoughts with the community
5. **Engage** - Like posts and comment to participate in discussions

### For Administrators (Admin Account Required)
1. **User Management** (`/admin/users`)
   - Search and filter users by first/last name
   - Edit user profiles (name, email, occupation, location)
   - Delete user accounts with confirmation
   - Pagination for managing large user databases
2. **Content Management** (`/admin/posts`)
   - Search posts by content
   - Filter posts by date range
   - Delete inappropriate or spam posts
   - Pagination for browsing all community posts

### For Developers
1. **Frontend** - See `client/src/` for React components and pages
2. **Backend** - See `server/` for Express routes and controllers
3. **State Management** - Check `stores/` folder for Zustand store setup
4. **Styling** - Tailwind CSS is configured with custom brand colors in `tailwind.config.js`
5. **API Documentation** - All endpoints documented in the [API Endpoints Summary](#-api-endpoints-summary) section

---

## 📱 Frontend Routing

| Route | Page | Access | Purpose |
|-------|------|--------|---------|
| `/login` | Login | Public | User authentication |
| `/register` | Register | Public | New user account creation |
| `/home` | Home (Own Profile) | Authenticated | View personal dashboard and posts |
| `/home/:userId` | Home (User Profile) | Authenticated | View other users' profiles and posts |
| `/blogs` | Blogs Feed | Authenticated | Browse all community blog posts |
| `/network` | Network Directory | Authenticated | Discover community members |
| `/admin` | Admin Dashboard | Admin Only | Access admin control panel |
| `/admin/users` | User Manager | Admin Only | Manage user accounts |
| `/admin/users/:id` | User Update | Admin Only | Edit individual user details |
| `/admin/posts` | Content Manager | Admin Only | Manage blog posts |

---

## 📁 Project Structure

```
CodeBloggs/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── pages/                  # Page components (views)
│   │   │   ├── Home.jsx            # User dashboard and profile (own or other users)
│   │   │   ├── Blogs.jsx           # Community feed - all blog posts
│   │   │   ├── Network.jsx         # Community directory - discover members
│   │   │   ├── Login.jsx           # User authentication page
│   │   │   ├── Register.jsx        # User registration (with Google Places)
│   │   │   ├── Admin.jsx           # Admin dashboard (admin-only)
│   │   │   ├── UserManager.jsx     # Admin: user management tool
│   │   │   ├── UserUpdate.jsx      # Admin: update user details
│   │   │   └── ContentManager.jsx  # Admin: manage blog posts
│   │   ├── components/             # Reusable React components
│   │   │   ├── Layout.jsx          # Master responsive container (768px breakpoint)
│   │   │   ├── Header.jsx          # Top navigation bar with user menu
│   │   │   ├── Sidebar.jsx         # Desktop navigation (≥768px)
│   │   │   ├── MobileNavigation.jsx # Mobile/tablet nav (<768px)
│   │   │   ├── PostModal.jsx       # Modal for creating new posts
│   │   │   ├── Record.jsx          # Individual blog post display
│   │   │   ├── Toast.jsx           # Notification system
│   │   │   ├── AvatarInitials.jsx  # User avatar with initials
│   │   │   ├── ProtectedRoute.jsx  # Authentication HOC for routes
│   │   │   ├── SkeletonLoader.jsx  # Loading placeholder
│   │   │   ├── UpdateConfirmationModal.jsx
│   │   │   ├── DeleteConfirmationModal.jsx
│   │   │   └── UserManager/        # Admin user components
│   │   ├── context/                # React Context for state management
│   │   │   ├── SessionContext.jsx  # User session & auth state
│   │   │   ├── PostModalContext.jsx # Post modal state
│   │   │   └── ToastContext.jsx    # Notifications state
│   │   ├── stores/                 # Zustand state management
│   │   │   ├── sessionStore.js
│   │   │   ├── postStore.js
│   │   │   ├── userStore.js
│   │   │   └── toastStore.js
│   │   ├── layouts/                # Layout components
│   │   ├── utils/                  # Utility functions
│   │   ├── App.jsx                 # Main application component with routing
│   │   ├── main.jsx                # Application entry point
│   │   ├── App.css                 # Application styles
│   │   └── index.css               # Global styles with responsive breakpoints
│   ├── public/                     # Static assets
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS with custom brand colors
│   └── eslint.config.js            # ESLint configuration
├── server/                          # Backend Express application
│   ├── routes/                     # API route definitions
│   │   ├── user.routes.js          # User registration & management
│   │   ├── session.routes.js       # Authentication & sessions
│   │   ├── post.routes.js          # Blog posts CRUD
│   │   └── comment.routes.js       # Comments CRUD
│   ├── controllers/                # Business logic handlers
│   │   ├── user.controller.js
│   │   ├── session.controller.js
│   │   ├── post.controller.js
│   │   └── comment.controller.js
│   ├── db/                         # Database configuration
│   │   ├── connection.js           # MongoDB connection
│   │   └── schemas/                # Mongoose data models
│   ├── server.js                   # Express server & middleware setup
│   ├── loadEnvironment.js          # Environment variables config
│   └── package.json                # Backend dependencies
├── docs/                           # Project documentation
│   ├── RESPONSIVE_DESIGN.md        # Responsive design details
│   ├── SESSION_TOKEN_VALIDATION.md # Auth documentation
│   ├── AI_SPEC — Project Specification (Main).md # Full spec
│   └── ai/features/                # Feature documentation
├── Wireframe assets/               # UI/UX designs
└── README.md                       # This file
```

---

## 🔗 API Endpoints Summary

### User Endpoints
- `POST /user/register` — Register new user
- `GET /users` — Get all users (with pagination)
- `GET /user/:id` — Get user by ID
- `PATCH /user/:id` — Update user profile
- `DELETE /user/:id` — Delete user account

### Session/Authentication Endpoints
- `POST /session/login` — Authenticate user and create session
- `POST /session/logout` — End user session
- `GET /session/validate_token` — Validate JWT token and get user info
- `GET /sessions` — Get all active sessions (admin only)

### Post Endpoints
- `POST /post` — Create new blog post
- `GET /posts` — Get all posts (with pagination)
- `GET /posts/user/:userId` — Get posts by specific user
- `GET /post/:id` — Get single post
- `PATCH /post/:id` — Update post
- `DELETE /post/:id` — Delete post

### Comment Endpoints
- `POST /comment` — Create comment on post
- `GET /comments` — Get all comments
- `GET /comment/:id` — Get single comment
- `PATCH /comment/:id` — Update comment
- `DELETE /comment/:id` — Delete comment

**Response Format:** All API responses follow the standard format with `status`, `data`, and `message` fields.

---

## 📡 API Documentation

All API endpoints return responses in the following format:

```json
{
  "status": "ok",
  "data": { /* Response data */ },
  "message": "Descriptive message"
}
```

### Authentication & Sessions

#### Register User
```
POST /register

Body Parameters:
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "birthday": "1990-01-15",
  "occupation": "Full Stack Developer",
  "location": "San Francisco, CA"
}

Sample Response:
{
  "status": "ok",
  "data": {
    "user": {
      "_id": "userId123",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "auth_level": "basic"
    }
  },
  "message": "User registered successfully"
}
```

#### Login User
```
POST /login

Body Parameters:
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Sample Response:
{
  "status": "ok",
  "data": {
    "user": {
      "_id": "userId123",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "auth_level": "basic"
    },
    "session_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

#### Logout User
```
POST /logout

Sample Response:
{
  "status": "ok",
  "data": {},
  "message": "Logged out successfully"
}
```

### Users

#### Get User Profile
```
GET /user/:id

Path Parameters:
- id: MongoDB user ID

Sample Response:
{
  "status": "ok",
  "data": {
    "user": {
      "_id": "userId123",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "birthday": "1990-01-15T00:00:00.000Z",
      "occupation": "Full Stack Developer",
      "location": "San Francisco, CA",
      "status": "Building awesome apps!",
      "auth_level": "basic"
    }
  },
  "message": null
}
```

#### Get All Users
```
GET /users

Sample Response:
{
  "status": "ok",
  "data": {
    "users": [
      {
        "_id": "userId123",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "occupation": "Full Stack Developer",
        "location": "San Francisco, CA",
        "auth_level": "basic"
      },
      ...
    ]
  },
  "message": null
}
```

### Posts

#### Get All Posts
```
GET /posts

Sample Response:
{
  "status": "ok",
  "data": {
    "posts": [
      {
        "_id": "postId123",
        "user_id": "userId123",
        "content": "Just deployed my new React app!",
        "timestamp": "2026-03-12T10:30:00.000Z",
        "likes": 5,
        "comments": ["commentId1", "commentId2"]
      },
      ...
    ]
  },
  "message": null
}
```

#### Get Posts by User
```
GET /posts/user/:id

Path Parameters:
- id: MongoDB user ID

Sample Response:
{
  "status": "ok",
  "data": {
    "posts": [
      {
        "_id": "postId123",
        "user_id": "userId123",
        "content": "Just deployed my new React app!",
        "timestamp": "2026-03-12T10:30:00.000Z",
        "likes": 5,
        "comments": []
      }
    ]
  },
  "message": null
}
```

#### Create Post
```
POST /posts

Body Parameters:
{
  "user_id": "userId123",
  "content": "Just deployed my new React app!"
}

Sample Response:
{
  "status": "ok",
  "data": {
    "post": {
      "_id": "postId123",
      "user_id": "userId123",
      "content": "Just deployed my new React app!",
      "timestamp": "2026-03-12T10:30:00.000Z",
      "likes": 0,
      "comments": []
    }
  },
  "message": "Post created successfully"
}
```

#### Like Post
```
POST /posts/:postId/like

Path Parameters:
- postId: MongoDB post ID

Sample Response:
{
  "status": "ok",
  "data": {
    "post": {
      "_id": "postId123",
      "likes": 6
    }
  },
  "message": "Post liked successfully"
}
```

### Comments

#### Create Comment
```
POST /posts/:postId/comment

Path Parameters:
- postId: MongoDB post ID

Body Parameters:
{
  "user_id": "userId123",
  "content": "Great post! Love the approach."
}

Sample Response:
{
  "status": "ok",
  "data": {
    "comment": {
      "_id": "commentId123",
      "post_id": "postId123",
      "user_id": "userId123",
      "content": "Great post! Love the approach.",
      "timestamp": "2026-03-12T10:45:00.000Z"
    }
  },
  "message": "Comment added successfully"
}
```

---

## 🔐 Authentication & Security

### How Authentication Works
1. User registers or logs in with email and password
2. Backend validates credentials and creates a secure session
3. Session token (JWT-like) is returned and stored in HTTP-only cookies
4. Token is validated on every protected route navigation
5. If token is invalid or expired, user is redirected to login

### Session Management
- Sessions expire after **24 hours** using MongoDB TTL indexes
- Passwords are securely hashed using **bcrypt** before storage
- HTTP-only cookies prevent JavaScript from accessing session tokens
- `ProtectedRoute` component validates session on every route change

### Admin Access
- Admin status is determined by user `auth_level` in the database
- Admin-only pages (`/admin`, `/admin/users`, `/admin/posts`) automatically redirect non-admins
- Contact project administrator to gain admin privileges

---

## 📖 Code Architecture Highlights

### State Management (Zustand Stores)
```
stores/
├── sessionStore.js  → Tracks user session and authentication state
├── postStore.js     → Manages blog posts for display
├── userStore.js     → Manages user list data
└── toastStore.js    → Controls toast notifications
```

### Component Hierarchy
```
Layout (responsive container)
├── Header (top nav with user menu)
├── Sidebar (desktop nav ≥768px) OR MobileNavigation (<768px)
├── PostModal (create new posts)
├── Toast (notifications)
└── Outlet (page content)
    ├── Home, Blogs, Network, Admin pages, etc.
    └── Post, Comments components
```

### Responsive Design Strategy
- **Mobile-first approach** - Design for 320px, enhance upward
- **Primary breakpoint: 768px** - iPad landscape, where nav switches from hamburger to sidebar
- **Secondary breakpoints:** 480px (larger phones), 1024px (large desktops), 1200px (extra-large screens)
- **Touch-friendly:** Minimum 44-48px tap targets on mobile
- **Fluid typography** - Uses CSS `clamp()` for scalable text

---

## 📱 Responsive Threshold Justification

CodeBloggs uses a **mobile-first responsive design** with the following key breakpoints:

| Breakpoint | Width | Device | Strategy |
|-----------|-------|--------|----------|
| **Extra Small** | < 480px | Small phones | Single-column, full-width layout |
| **Small** | 480px - 767px | Large phones/tablets (portrait) | 2-column grid system |
| **Medium** | 768px+ | Tablets (landscape) & desktops | Desktop navigation & multi-column layout |
| **Large** | 1024px+ | Small desktops | Optimized spacing & typography |
| **Extra Large** | 1200px+ | Large desktops | Full-width multi-column layouts |

### Primary Breakpoint: 768px (iPad Landscape Standard)

**Why 768px?**
- Industry standard for tablet landscape width (iPad)
- Clear inflection point where single-column mobile layouts can expand to multi-column desktop layouts
- Based on **MDN Web Development Best Practices** for responsive design

**UX Issues Solved:**
- **Navigation Model Switch**: Below 768px, users get a hamburger menu (fixed top bar); at 768px+, sidebar appears. This solves mobile touch usability without cluttering desktop space.
- **Layout Adaptability**: Two-column post layouts collapse to single-column on mobile, reducing cognitive load and improving readability on small screens.
- **Touch Targets**: Mobile layouts enforce 44-48px minimum button heights; desktop layouts optimize for mouse/trackpad precision.
- **Content Legibility**: Typography scales using fluid sizing (`clamp()`) to remain readable across all window sizes without jarring jumps.
- **No Horizontal Scrolling**: All content adapts to viewport width, preventing frustrating horizontal scroll on mobile devices.

### Secondary Breakpoints

- **480px**: Enables 2-column grid for larger phones (e.g., Network section user cards)
- **1024px**: Optimizes spacing and multi-column layouts for larger desktops
- **1200px**: Full-width multi-column experiences for ultra-wide screens

This progressive enhancement approach ensures CodeBloggs provides an optimal experience whether accessed on a smartphone, tablet, or desktop computer.

---

## 🔬 Reactive vs. Responsive

A Reactive Website is a site designed to be dynamic relying on user input and user interactivity. It contains elements that interact with the user such as a chat application or social media feed that updates instantly. This reactive design creates a fluid and seamless flow of information, enhancing user engagement and providing an enjoyable user experience.

A Responsive Website is designed for adaptability based on device. Responsive web design provides an optimal viewing and interaction experience across a wide range of devices. The responsive layout dynamically resizes and rearranges content to ensure a clear and usable experience.

This is the most common approach to modern web design and is the standard for building mobile-friendly websites.

---

## 🗄️ SQL and Relational Basics

### What is SQL?

SQL (Structured Query Language) is a standardized programming language used to manage and interact with relational databases. It allows developers to create, read, update, and delete (CRUD) data from databases in a structured and efficient way. SQL is used to define the database schema (tables, columns, constraints), manipulate data (INSERT, UPDATE, DELETE), and retrieve data (SELECT) using complex queries.

**Note:** While CodeBloggs uses **MongoDB** (a NoSQL document database), understanding SQL and relational concepts is essential for web development, as many applications still rely on traditional relational databases like MySQL, PostgreSQL, and SQLite.

---

### Main Differences: SQLite vs MySQL

While both SQLite and MySQL are popular SQL-based databases, they have key differences:

| Feature | SQLite | MySQL |
|---------|--------|-------|
| **Architecture** | Lightweight, file-based, embedded | Server-based, requires separate server |
| **Use Case** | Small applications, mobile apps, single-user | Enterprise applications, multi-user systems |
| **Scalability** | Limited (local/small datasets) | Highly scalable (handles large datasets) |
| **Concurrent Users** | Limited concurrent access | Supports thousands of concurrent users |
| **Setup** | No installation required | Requires server setup and configuration |
| **Performance** | Fast for small datasets | Optimized for large-scale operations |
| **Security** | Basic file-level security | Advanced user authentication & permissions |
| **Cost** | Free & open-source | Free & open-source (MariaDB alternative) |

**Example:** A mobile app might use SQLite for local data storage, while a web application like CodeBloggs uses MongoDB or MySQL for server-side data management.

---

### Primary Keys and Foreign Keys

#### Primary Key (🔑)
A **Primary Key** is a unique identifier for each record (row) in a table. It ensures that every row can be uniquely identified and prevents duplicate entries.

**Characteristics:**
- Must contain unique values
- Cannot be NULL (must always have a value)
- Only ONE primary key per table
- Speeds up data retrieval and sorting

**Example:**
```sql
CREATE TABLE users (
  user_id INT PRIMARY KEY,
  first_name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);
```

#### Foreign Key (🔗)
A **Foreign Key** is a column (or set of columns) that creates a relationship between two tables. It references the Primary Key of another table, maintaining data integrity and establishing relationships.

**Characteristics:**
- References a Primary Key in another table
- Enforces referential integrity (prevents orphaned records)
- Can have multiple Foreign Keys in one table
- Enables table joins and complex queries

**Example:**
```sql
CREATE TABLE posts (
  post_id INT PRIMARY KEY,
  user_id INT,
  content TEXT,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

---

### Types of Database Relationships

Database relationships define how tables interact with each other. There are three main types:

#### 1️⃣ **One-to-One (1:1) Relationship** 🔗

A record in Table A is related to **exactly one** record in Table B, and vice versa.

**Example: User ↔ UserProfile**
```sql
-- Users Table
CREATE TABLE users (
  user_id INT PRIMARY KEY,
  email VARCHAR(100) UNIQUE
);

-- User Profiles Table (each user has exactly ONE profile)
CREATE TABLE user_profiles (
  profile_id INT PRIMARY KEY,
  user_id INT UNIQUE,
  bio TEXT,
  avatar_url VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

**Real-world scenario:** Only one bio and avatar per user account.

---

#### 1️⃣➡️📚 **One-to-Many (1:N) Relationship**

A record in Table A can be related to **multiple** records in Table B, but each record in Table B is related to **only one** record in Table A.

**Example: User ➡️ Posts**
```sql
-- Users Table
CREATE TABLE users (
  user_id INT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100)
);

-- Posts Table (one user can create MANY posts)
CREATE TABLE posts (
  post_id INT PRIMARY KEY,
  user_id INT,
  content TEXT,
  timestamp DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

**Real-world scenario:** One user can write many blog posts, but each post belongs to only one author. This is the most common relationship type in CodeBloggs.

---

#### 🌐 **Many-to-Many (M:N) Relationship**

Records in Table A can be related to **multiple** records in Table B, and vice versa. This requires a **junction table** (also called a bridge or join table).

**Example: Users ↔ Tags** (e.g., users can like multiple posts, posts can be liked by many users)
```sql
-- Users Table
CREATE TABLE users (
  user_id INT PRIMARY KEY,
  first_name VARCHAR(100)
);

-- Posts Table
CREATE TABLE posts (
  post_id INT PRIMARY KEY,
  content TEXT
);

-- Junction Table: likes (tracks which users like which posts—MANY-to-MANY)
CREATE TABLE likes (
  like_id INT PRIMARY KEY,
  user_id INT,
  post_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id),
  UNIQUE (user_id, post_id) -- Prevents duplicate likes
);
```

**Real-world scenario:** One user likes many posts; one post is liked by many users. The `likes` junction table tracks this relationship.

---

### Relationship Summary for CodeBloggs

| Relationship | Tables | Example |
|-------------|--------|---------|
| **One-to-One** 🔗 | User ↔ UserProfile | Each user has one profile |
| **One-to-Many** 1️⃣➡️📚 | User → Posts | One user writes many posts |
| **One-to-Many** 1️⃣➡️📚 | Post → Comments | One post has many comments |
| **Many-to-Many** 🌐 | Users ↔ Followers | Users can follow many users; users can be followed by many |
| **Many-to-Many** 🌐 | Users ↔ Posts (Likes) | Users like many posts; posts are liked by many users |

---

### CodeBloggs Database Model (MongoDB Document-Based)

While CodeBloggs uses **MongoDB** (a NoSQL, document-based database) instead of traditional SQL, the conceptual relationships remain similar:

- **User** has many **Posts** (One-to-Many)
- **Post** has many **Comments** (One-to-Many)
- **User** has many **Followers** (Many-to-Many)
- **User** has one **Profile** (One-to-One, could be embedded in user document)

MongoDB stores these relationships differently (using document embedding and references) but achieves the same logical structure.

---

## 📊 Database Collections (MongoDB)

### Users Collection
Stores user profile information and authentication data (first name, last name, email, password hash, occupation, location, etc.)

### Posts Collection
Stores all blog posts created by users, with timestamps, content, and references to user IDs who created them.

### Comments Collection
Stores comments on posts, with content, timestamps, and references to both post IDs and user IDs.

### Sessions Collection
Stores active user sessions with TTL (Time-To-Live) index set to 24 hours for automatic expiration and cleanup.

---

## 🔄 Development Workflow

### Build Frontend
```bash
cd client
npm run build
```

### Lint Frontend Code
```bash
cd client
npm run lint
```

### Preview Production Build
```bash
cd client
npm run preview
```

### Watch Mode (Continuous Development)
```bash
# Terminal 1: Backend with auto-reload
cd server
npm start

# Terminal 2: Frontend with hot reload
cd client
npm run dev
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### **Port Already in Use**
- **Error:** `listen EADDRINUSE :::5050`
- **Solution:** Change the `PORT` in `.env` or kill the process using that port
  ```bash
  # Find process using port 5050
  lsof -i :5050
  # Kill it
  kill -9 <PID>
  ```

#### **MongoDB Connection Failed**
- **Error:** `Cannot connect to MongoDB`
- **Solutions:**
  - Ensure MongoDB is running locally: `mongod`
  - Or update `MONGODB_URI` to your MongoDB Atlas connection string
  - Check that your IP is whitelisted in MongoDB Atlas

#### **CORS Errors**
- **Error:** `Access to XMLHttpRequest blocked by CORS policy`
- **Solution:** Ensure backend is running on `http://localhost:5050` and frontend uses correct API base URL

#### **Session Token Invalid/Expired**
- **Error:** Redirected to login page unexpectedly
- **Solution:** Session expired after 24 hours - simply log in again

#### **Responsive Layout Not Switching at 768px**
- **Check:** Browser window is resized properly or DevTools device toggle is working
- **Clear:** Browser cache (may have cached CSS)
- **Update:** Check that `Layout.jsx` event listener is properly detecting window resize

#### **Posts Not Loading**
- **Check:** Backend server is running on `http://localhost:5050`
- **Check:** MongoDB has data in `posts` collection
- **Check:** API response format includes `status: "ok"`

---

## 🎨 Color Palette

The application uses the following color scheme:

| Color | Hex Code | Name |
|-------|----------|------|
| Primary | `#403E6B` | Delft Blue |
| Light | `#D3D1EE` | Lavender (web) |
| Secondary | `#8D88EA` | Tropical Indigo |
| Accent | `#B1ADFF` | Periwinkle |
| Dark | `#5F5E6B` | Dim Gray |
| Alternative | `#6E6AB8` | Slate Blue |

---

## 📚 Additional Resources

- **Project Specification:** See [docs/AI_SPEC — Project Specification (Main).md](docs/AI_SPEC%20—%20Project%20Specification%20(Main).md)
- **Feature Documentation:** Detailed documentation for each feature is available in the `docs/` folder with `🤖 AI_FEATURE_*.md` files
- **Wireframes:** UI/UX wireframes are available in the `Wireframe assets/` folder

---

## 👤 Author
**Creator:** Charles Winfield
**Project:** CodeBloggs  
**Organization:** CodeBoxx School  
**Module:** 09-10 (MERN Stack Development)  
**Last Updated:** March 2026

---

## 📝 Notes

- The backend uses MongoDB as the primary database. Ensure you have MongoDB running locally or have a MongoDB Atlas connection string ready.
- Sessions are automatically expired after 24 hours using MongoDB TTL (Time-To-Live) indexes.
- Passwords are securely hashed using bcrypt before being stored in the database.
- The application uses HTTP-only cookies for session management to enhance security.

---

For more information, refer to the feature documentation in the `docs/` folder or contact the project administrator.
