# CodeBloggs API Endpoints by Page/Wireframe

## Base URL
`http://localhost:5050`

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

---

## ADMIN PAGE

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | List all users |
| GET | /user/:id | View user details |
| PATCH | /user/:id | Edit user information |
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
