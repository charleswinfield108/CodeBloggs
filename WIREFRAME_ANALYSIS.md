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
