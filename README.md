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

## 📁 Project Structure

```
CodeBloggs/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   ├── context/                # React Context for state management
│   │   ├── layouts/                # Layout components
│   │   ├── pages/                  # Page components (Login, Register, Home, etc.)
│   │   ├── utils/                  # Utility functions
│   │   ├── App.jsx                 # Main application component
│   │   ├── main.jsx                # Application entry point
│   │   └── index.css               # Global styles
│   ├── public/                     # Static assets
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── eslint.config.js            # ESLint configuration
├── server/                          # Backend Express application
│   ├── controllers/                # Route controllers (user, post, comment, session)
│   ├── routes/                     # API route definitions
│   ├── db/                         # Database connection and schemas
│   ├── server.js                   # Express server entry point
│   ├── loadEnvironment.js          # Environment variables loader
│   └── package.json                # Server dependencies
├── docs/                           # Project documentation
│   ├── AI_SPEC — Project Specification (Main).md
│   └── 🤖 AI_FEATURE_*.md         # Feature documentation
├── Wireframe assets/               # UI/UX wireframe images
└── README.md                       # This file
```

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

## 👤 Author

**Project:** CodeBloggs  
**Organization:** CodeBoxx School  
**Module:** 09-10 (MERN Stack Development)  
**Last Updated:** March 2026

---

## 📚 Additional Resources

- **Project Specification:** See [docs/AI_SPEC — Project Specification (Main).md](docs/AI_SPEC%20—%20Project%20Specification%20(Main).md)
- **Feature Documentation:** Detailed documentation for each feature is available in the `docs/` folder with `🤖 AI_FEATURE_*.md` files
- **Wireframes:** UI/UX wireframes are available in the `Wireframe assets/` folder

---

## 📝 Notes

- The backend uses MongoDB as the primary database. Ensure you have MongoDB running locally or have a MongoDB Atlas connection string ready.
- Sessions are automatically expired after 24 hours using MongoDB TTL (Time-To-Live) indexes.
- Passwords are securely hashed using bcrypt before being stored in the database.
- The application uses HTTP-only cookies for session management to enhance security.

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

---

For more information, refer to the feature documentation in the `docs/` folder or contact the project administrator.

```

```
---

## CodeBlogg - Post Modal

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---

## Main - User View

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---

## Main - Bloggs View

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---

## Main - Network View

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---

## Main Admin view

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---
## CodeBlogg - Admin view

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---