# CodeBloggs API Endpoints by Page/Wireframe

## Base URL
`http://localhost:5050`

---

## Standard Error Response Formats

### HTTP Status Codes
- **200 OK** — Request succeeded
- **201 Created** — Resource created successfully
- **400 Bad Request** — Invalid request data or missing required fields
- **404 Not Found** — Resource not found
- **500 Internal Server Error** — Server error

### Common Error Response Formats

#### 400 Bad Request (Invalid Data)
```json
{
  "error": "Invalid user data"
}
```

#### 400 Bad Request (Missing Required Fields)
```json
{
  "error": "Missing required fields: content, user_id, or post_id"
}
```

#### 400 Bad Request (Invalid ID Format)
```json
{
  "error": "Invalid post ID"
}
```

#### 404 Not Found
```json
{
  "error": "User not found"
}
```

#### 404 Not Found (Alternative Format)
```json
{
  "status": "error",
  "data": null,
  "message": "Comment not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

#### 500 Internal Server Error (Specific)
```json
{
  "error": "Failed to delete comments"
}
```

---

## LOGIN PAGE

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /session/login | Login user with email and password |

---

## REGISTRATION PAGE

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /user/register | Register a new user account |

---

## MAIN PAGE (Home - with Post Modal & Logout)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /validate_token | Validate user token on page load |
| GET | /posts | Display all posts on home feed |
| POST | /post | Create new post from modal |
| POST | /session/logout | Logout user |
| POST | /user/ping | Record user activity/last seen time |
| GET | /user/:id | Get current user profile |

---

## BLOGS PAGE

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /posts | Get all blog posts |
| GET | /post/:id | Get single blog post details |
| PATCH | /post/:id | Update blog post (if author) |
| DELETE | /post/:id | Delete blog post (if author) |
| POST | /comment | Add comment to blog post |
| GET | /comments | Get all comments for posts |
| PATCH | /comment/:id | Update comment (if author) |
| DELETE | /comment/:id | Delete comment (if author) |

---

## NETWORK PAGE

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | Get list of all users |
| GET | /user/:id | View user profile |
| GET | /info/:id | Get user info/details |
| GET | /infos | Get all users info |
| GET | /posts/user/:userId | Get all posts by a specific user |
| POST | /user/ping | Record user activity/last seen time |

---

## ADMIN PAGE

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | List all users |
| GET | /user/:id | View user details |
| PATCH | /user/:id | Edit user information |
| PATCH | /user/:id/status | Update user status |
| DELETE | /user/:id | Delete user account |
| GET | /posts | View all posts |
| GET | /post/:id | View post details |
| DELETE | /post/:id | Delete user posts |
| GET | /comments | View all comments |
| DELETE | /comment/:id | Delete comments |
| GET | /sessions | View all user sessions |
| GET | /session/:id | View session details |
| POST | /session/:id | Create session |

---

## JSON Sample Responses

### LOGIN PAGE

#### POST /session/login
**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k1.jpg",
    "bio": "Software developer and tech enthusiast",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### REGISTRATION PAGE

#### POST /user/register
**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": null,
    "bio": "",
    "createdAt": "2024-01-20T14:22:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error - 409):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### MAIN PAGE (Home)

#### GET /validate_token
**Response (Valid - 200):**
```json
{
  "valid": true,
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Response (Invalid - 401):**
```json
{
  "valid": false,
  "message": "Token expired or invalid"
}
```

#### GET /posts
**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "posts": [
    {
      "_id": "65d2e4f5a6b7c8d9e0f1g2h3",
      "author": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k1.jpg"
      },
      "title": "Getting Started with React",
      "content": "React is a JavaScript library for building user interfaces with components...",
      "image": "https://api.example.com/uploads/post-65d2e4f5a6b7c8d9e0f1g2h3.jpg",
      "likes": 25,
      "commentCount": 5,
      "createdAt": "2024-01-18T09:15:00Z",
      "updatedAt": "2024-01-18T09:15:00Z"
    },
    {
      "_id": "65d2e4f5a6b7c8d9e0f1g2h4",
      "author": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "username": "janedoe",
        "firstName": "Jane",
        "lastName": "Doe",
        "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k2.jpg"
      },
      "title": "Web Development Best Practices",
      "content": "In this post, I'll share key practices for better web development...",
      "image": null,
      "likes": 42,
      "commentCount": 8,
      "createdAt": "2024-01-17T14:45:00Z",
      "updatedAt": "2024-01-17T14:45:00Z"
    }
  ]
}
```

#### POST /post
**Request:**
```json
{
  "title": "My First Blog Post",
  "content": "This is my first blog post on CodeBloggs. I'm excited to share my thoughts...",
  "image": null
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "_id": "65d2e4f5a6b7c8d9e0f1g2h5",
    "author": "64a1b2c3d4e5f6g7h8i9j0k1",
    "title": "My First Blog Post",
    "content": "This is my first blog post on CodeBloggs. I'm excited to share my thoughts...",
    "image": null,
    "likes": 0,
    "commentCount": 0,
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

#### POST /session/logout
**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /user/:id
**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k1.jpg",
    "bio": "Software developer and tech enthusiast",
    "posts": 12,
    "followers": 45,
    "following": 38,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### BLOGS PAGE

#### GET /posts
**Response (200):**
```json
{
  "success": true,
  "count": 15,
  "posts": [
    {
      "_id": "65d2e4f5a6b7c8d9e0f1g2h3",
      "author": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k1.jpg"
      },
      "title": "Advanced JavaScript Concepts",
      "content": "Understanding closures, hoisting, and async/await...",
      "image": "https://api.example.com/uploads/post-65d2e4f5a6b7c8d9e0f1g2h3.jpg",
      "likes": 67,
      "commentCount": 12,
      "createdAt": "2024-01-18T09:15:00Z",
      "updatedAt": "2024-01-18T09:15:00Z"
    }
  ]
}
```

#### GET /post/:id
**Response (200):**
```json
{
  "success": true,
  "post": {
    "_id": "65d2e4f5a6b7c8d9e0f1g2h3",
    "author": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k1.jpg",
      "bio": "Software developer and tech enthusiast"
    },
    "title": "Advanced JavaScript Concepts",
    "content": "Understanding closures, hoisting, and async/await...",
    "image": "https://api.example.com/uploads/post-65d2e4f5a6b7c8d9e0f1g2h3.jpg",
    "likes": 67,
    "liked": false,
    "commentCount": 12,
    "createdAt": "2024-01-18T09:15:00Z",
    "updatedAt": "2024-01-18T09:15:00Z"
  }
}
```

#### PATCH /post/:id
**Request:**
```json
{
  "title": "Advanced JavaScript Concepts - Updated",
  "content": "Updated content with more examples..."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "post": {
    "_id": "65d2e4f5a6b7c8d9e0f1g2h3",
    "author": "64a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Advanced JavaScript Concepts - Updated",
    "content": "Updated content with more examples...",
    "image": "https://api.example.com/uploads/post-65d2e4f5a6b7c8d9e0f1g2h3.jpg",
    "likes": 67,
    "commentCount": 12,
    "createdAt": "2024-01-18T09:15:00Z",
    "updatedAt": "2024-01-20T11:45:00Z"
  }
}
```

#### DELETE /post/:id
**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

#### POST /comment
**Request:**
```json
{
  "postId": "65d2e4f5a6b7c8d9e0f1g2h3",
  "content": "Great post! This really helped me understand closures better."
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "comment": {
    "_id": "65d2f6g7h8i9j0k1l2m3n4o5",
    "postId": "65d2e4f5a6b7c8d9e0f1g2h3",
    "author": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "username": "janedoe",
      "firstName": "Jane",
      "lastName": "Doe",
      "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k2.jpg"
    },
    "content": "Great post! This really helped me understand closures better.",
    "likes": 0,
    "createdAt": "2024-01-20T12:10:00Z",
    "updatedAt": "2024-01-20T12:10:00Z"
  }
}
```

#### GET /comments
**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "comments": [
    {
      "_id": "65d2f6g7h8i9j0k1l2m3n4o5",
      "postId": "65d2e4f5a6b7c8d9e0f1g2h3",
      "author": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "username": "janedoe",
        "firstName": "Jane",
        "lastName": "Doe",
        "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k2.jpg"
      },
      "content": "Great post! This really helped me understand closures better.",
      "likes": 3,
      "createdAt": "2024-01-20T12:10:00Z",
      "updatedAt": "2024-01-20T12:10:00Z"
    }
  ]
}
```

#### PATCH /comment/:id
**Request:**
```json
{
  "content": "Great post! This really helped me understand closures better. Updated version."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "comment": {
    "_id": "65d2f6g7h8i9j0k1l2m3n4o5",
    "postId": "65d2e4f5a6b7c8d9e0f1g2h3",
    "author": "64a1b2c3d4e5f6g7h8i9j0k2",
    "content": "Great post! This really helped me understand closures better. Updated version.",
    "likes": 3,
    "createdAt": "2024-01-20T12:10:00Z",
    "updatedAt": "2024-01-20T13:25:00Z"
  }
}
```

#### DELETE /comment/:id
**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

### NETWORK PAGE

#### GET /users
**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "users": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k1.jpg",
      "bio": "Software developer and tech enthusiast",
      "followers": 45,
      "following": 38,
      "isFollowing": false
    },
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "username": "janedoe",
      "firstName": "Jane",
      "lastName": "Doe",
      "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k2.jpg",
      "bio": "UX Designer and creative thinker",
      "followers": 62,
      "following": 51,
      "isFollowing": true
    }
  ]
}
```

#### GET /user/:id
**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k1.jpg",
    "bio": "Software developer and tech enthusiast",
    "followers": 45,
    "following": 38,
    "posts": 12,
    "isFollowing": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /info/:id
**Response (200):**
```json
{
  "success": true,
  "userInfo": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k1.jpg",
    "bio": "Software developer and tech enthusiast",
    "location": "San Francisco, CA",
    "website": "https://johndoe.dev",
    "joinDate": "2024-01-15",
    "stats": {
      "posts": 12,
      "followers": 45,
      "following": 38,
      "totalLikes": 234
    }
  }
}
```

#### GET /infos
**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "infos": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k1.jpg",
      "bio": "Software developer and tech enthusiast",
      "location": "San Francisco, CA",
      "joinDate": "2024-01-15",
      "stats": {
        "posts": 12,
        "followers": 45,
        "following": 38
      }
    }
  ]
}
```

---

### ADMIN PAGE

#### GET /users
**Response (200):**
```json
{
  "success": true,
  "count": 25,
  "users": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k1.jpg",
      "role": "user",
      "status": "active",
      "posts": 12,
      "createdAt": "2024-01-15T10:30:00Z",
      "lastLogin": "2024-01-20T14:22:00Z"
    }
  ]
}
```

#### GET /user/:id (Admin)
**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k1.jpg",
    "bio": "Software developer and tech enthusiast",
    "role": "user",
    "status": "active",
    "posts": 12,
    "followers": 45,
    "following": 38,
    "registrationDate": "2024-01-15T10:30:00Z",
    "lastLogin": "2024-01-20T14:22:00Z",
    "totalLikes": 234,
    "totalComments": 45
  }
}
```

#### PATCH /user/:id (Admin)
**Request:**
```json
{
  "firstName": "Jonathan",
  "bio": "Updated bio",
  "status": "active"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "Jonathan",
    "lastName": "Doe",
    "bio": "Updated bio",
    "status": "active",
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
```

#### DELETE /user/:id (Admin)
**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User account deleted successfully"
}
```

#### GET /posts (Admin)
**Response (200):**
```json
{
  "success": true,
  "count": 45,
  "posts": [
    {
      "_id": "65d2e4f5a6b7c8d9e0f1g2h3",
      "author": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe"
      },
      "title": "Advanced JavaScript Concepts",
      "content": "Understanding closures, hoisting, and async/await...",
      "likes": 67,
      "commentCount": 12,
      "status": "published",
      "createdAt": "2024-01-18T09:15:00Z"
    }
  ]
}
```

#### GET /post/:id (Admin)
**Response (200):**
```json
{
  "success": true,
  "post": {
    "_id": "65d2e4f5a6b7c8d9e0f1g2h3",
    "author": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "title": "Advanced JavaScript Concepts",
    "content": "Understanding closures, hoisting, and async/await...",
    "image": "https://api.example.com/uploads/post-65d2e4f5a6b7c8d9e0f1g2h3.jpg",
    "likes": 67,
    "commentCount": 12,
    "status": "published",
    "createdAt": "2024-01-18T09:15:00Z",
    "updatedAt": "2024-01-18T09:15:00Z"
  }
}
```

#### DELETE /post/:id (Admin)
**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

#### GET /comments (Admin)
**Response (200):**
```json
{
  "success": true,
  "count": 128,
  "comments": [
    {
      "_id": "65d2f6g7h8i9j0k1l2m3n4o5",
      "postId": "65d2e4f5a6b7c8d9e0f1g2h3",
      "author": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "username": "janedoe",
        "firstName": "Jane",
        "lastName": "Doe"
      },
      "content": "Great post! This really helped me understand closures better.",
      "likes": 3,
      "status": "published",
      "createdAt": "2024-01-20T12:10:00Z"
    }
  ]
}
```

#### DELETE /comment/:id (Admin)
**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

#### GET /sessions
**Response (200):**
```json
{
  "success": true,
  "count": 18,
  "sessions": [
    {
      "_id": "65d3a1b2c3d4e5f6g7h8i9j0",
      "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
      "username": "johndoe",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "loginTime": "2024-01-20T14:22:00Z",
      "lastActivity": "2024-01-20T15:45:00Z",
      "status": "active"
    }
  ]
}
```

#### GET /session/:id
**Response (200):**
```json
{
  "success": true,
  "session": {
    "_id": "65d3a1b2c3d4e5f6g7h8i9j0",
    "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "loginTime": "2024-01-20T14:22:00Z",
    "lastActivity": "2024-01-20T15:45:00Z",
    "expiresAt": "2024-02-20T14:22:00Z",
    "status": "active"
  }
}
```

#### POST /session/:id
**Request:**
```json
{
  "userId": "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Session created successfully",
  "session": {
    "_id": "65d3a1b2c3d4e5f6g7h8i9j0",
    "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "loginTime": "2024-01-20T16:00:00Z",
    "expiresAt": "2024-02-20T16:00:00Z",
    "status": "active"
  }
}
```

---

## ADDITIONAL ENDPOINTS

### USER MANAGEMENT

#### POST /user/ping
**Request:**
```json
{
  "userId": "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Response (Success - 200):**
```json
{
  "status": "ok",
  "message": "Activity recorded"
}
```

**Response (Error - 404):**
```json
{
  "error": "User not found"
}
```

#### PATCH /user/:id
**Request:**
```json
{
  "firstName": "Jonathan",
  "lastName": "Smith",
  "bio": "Updated bio text",
  "profileImage": "https://api.example.com/uploads/profile-new.jpg"
}
```

**Response (Success - 200):**
```json
{
  "status": "ok",
  "message": "User updated successfully"
}
```

**Response (Error - 404):**
```json
{
  "error": "User not found"
}
```

#### PATCH /user/:id/status
**Request:**
```json
{
  "status": "active"
}
```

**Response (Success - 200):**
```json
{
  "status": "ok",
  "message": "User status updated successfully"
}
```

#### DELETE /user/:id
**Response (Success - 200):**
```json
{
  "status": "ok",
  "message": "User deleted successfully. Deleted 5 posts associated with the user and 12 comments associated with those posts."
}
```

**Response (Error - 404):**
```json
{
  "error": "User not found"
}
```

### POST MANAGEMENT

#### GET /posts/user/:userId
**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "posts": [
    {
      "_id": "65d2e4f5a6b7c8d9e0f1g2h3",
      "author": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k1.jpg"
      },
      "title": "Advanced JavaScript Concepts",
      "content": "Understanding closures, hoisting, and async/await...",
      "image": "https://api.example.com/uploads/post-65d2e4f5a6b7c8d9e0f1g2h3.jpg",
      "likes": 67,
      "commentCount": 12,
      "createdAt": "2024-01-18T09:15:00Z",
      "updatedAt": "2024-01-18T09:15:00Z"
    }
  ]
}
```

#### PATCH /post/:id
**Request:**
```json
{
  "content": "Updated post content with more details",
  "likes": 70
}
```

**Response (Success - 200):**
```json
{
  "status": "ok",
  "data": {
    "_id": "65d2e4f5a6b7c8d9e0f1g2h3",
    "content": "Updated post content with more details",
    "user_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "likes": 70,
    "createdAt": "2024-01-18T09:15:00Z",
    "comments": [
      {
        "_id": "65d2f6g7h8i9j0k1l2m3n4o5",
        "postId": "65d2e4f5a6b7c8d9e0f1g2h3",
        "content": "Great update!",
        "likes": 3
      }
    ]
  },
  "message": "Post updated successfully"
}
```

**Response (Error - 404):**
```json
{
  "error": "Post not found"
}
```

#### DELETE /post/:id
**Response (Success - 200):**
```json
{
  "status": "ok",
  "message": "Post deleted successfully along with 5 associated comments"
}
```

**Response (Error - 404):**
```json
{
  "error": "Post not found"
}
```

### COMMENT MANAGEMENT

#### GET /comment/:id
**Response (200):**
```json
{
  "status": "ok",
  "data": {
    "_id": "65d2f6g7h8i9j0k1l2m3n4o5",
    "postId": "65d2e4f5a6b7c8d9e0f1g2h3",
    "author": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "username": "janedoe",
      "firstName": "Jane",
      "lastName": "Doe",
      "profileImage": "https://api.example.com/uploads/profile-64a1b2c3d4e5f6g7h8i9j0k2.jpg"
    },
    "content": "Great post! This really helped me understand closures better.",
    "likes": 3,
    "createdAt": "2024-01-20T12:10:00Z",
    "updatedAt": "2024-01-20T12:10:00Z"
  },
  "message": "Comment retrieved successfully"
}
```

**Response (Error - 404):**
```json
{
  "status": "error",
  "data": null,
  "message": "Comment not found"
}
```

#### PATCH /comment/:id
**Request:**
```json
{
  "content": "Updated comment with more details. This really helped me understand closures better!",
  "likes": 5
}
```

**Response (Success - 200):**
```json
{
  "status": "ok",
  "result": {
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
  },
  "data": {
    "_id": "65d2f6g7h8i9j0k1l2m3n4o5",
    "postId": "65d2e4f5a6b7c8d9e0f1g2h3",
    "author": "64a1b2c3d4e5f6g7h8i9j0k2",
    "content": "Updated comment with more details. This really helped me understand closures better!",
    "likes": 5,
    "createdAt": "2024-01-20T12:10:00Z",
    "updatedAt": "2024-01-20T13:30:00Z"
  },
  "message": "Comment updated successfully"
}
```

**Response (Error - 404):**
```json
{
  "error": "Comment not found"
}
```

#### DELETE /comment/:id
**Response (Success - 200):**
```json
{
  "status": "ok",
  "message": "Comment deleted successfully"
}
```

**Response (Error - 404):**
```json
{
  "status": "error",
  "message": "Comment not found"
}
```

---

## Error Response Reference Guide

### By Endpoint and Error Code

| Endpoint | Method | 400 Bad Request | 404 Not Found | 500 Error |
|----------|--------|-----------------|---------------|-----------|
| /session/login | POST | ✓ Invalid credentials | — | ✓ |
| /user/register | POST | ✓ ValidationError | — | ✓ |
| /user/ping | POST | ✓ Invalid ID format | ✓ User not found | ✓ |
| /user/:id | GET | ✓ Invalid ID format | ✓ User not found | ✓ |
| /user/:id | PATCH | ✓ Invalid data | ✓ User not found | ✓ |
| /user/:id/status | PATCH | ✓ Invalid status | ✓ User not found | ✓ |
| /user/:id | DELETE | ✓ Invalid ID format | ✓ User not found | ✓ |
| /post | POST | ✓ Missing fields | — | ✓ |
| /post/:id | GET | ✓ Invalid ID format | ✓ Post not found | ✓ |
| /post/:id | PATCH | ✓ Invalid data | ✓ Post not found | ✓ |
| /post/:id | DELETE | ✓ Invalid ID format | ✓ Post not found | ✓ |
| /posts/user/:userId | GET | ✓ Invalid ID format | — | ✓ |
| /comment | POST | ✓ Missing fields | — | ✓ |
| /comment/:id | GET | ✓ Invalid ID format | ✓ Comment not found | ✓ |
| /comment/:id | PATCH | ✓ Invalid data | ✓ Comment not found | ✓ |
| /comment/:id | DELETE | ✓ Invalid ID format | ✓ Comment not found | ✓ |
| /validate_token | GET | — | — | ✓ |

### Error Code Meanings

#### 400 Bad Request
- **Cause:** Invalid request data, missing required fields, or malformed ID
- **Common Scenarios:**
  - Sending invalid JSON
  - Missing required fields (e.g., `content`, `user_id`, `post_id`)
  - Invalid MongoDB ObjectId format
  - Empty or null values where specific formats required
  - Attempting to update with no fields

#### 404 Not Found
- **Cause:** Requested resource does not exist in database
- **Common Scenarios:**
  - User ID doesn't match any user
  - Post ID doesn't match any post
  - Comment ID doesn't match any comment
  - Session ID is invalid or expired

#### 500 Internal Server Error
- **Cause:** Unexpected server error or database operation failure
- **Common Scenarios:**
  - Database connection issues
  - Failed cascading delete operations
  - Hashing algorithm failure
  - Unhandled exceptions in processing

### Best Practices for Error Handling

1. **Always check status codes** — Don't assume success (2xx) by default
2. **Parse error messages** — Use the `error` or `message` field for user-friendly messages
3. **Log failures** — Keep records of failed requests for debugging
4. **Retry strategy** — Retry 500 errors; don't retry 400 or 404 errors
5. **Data validation** — Validate all required fields client-side before making requests
6. **Cascade operations** — Understand that deleting a user/post may cascade to comments
7. **ID validation** — Ensure MongoDB ObjectIds are properly formatted before API calls
