AI_SPEC — Project Specification (Main)


## Project Identity

CodeBloggs is a social media web application designed specifically for programmers and developers. The platform allows users to create and share blog posts, comment on posts, and like content from other users.

The application will be built using the MERN stack (MongoDB, Express, React, Node.js) and developed collaboratively with separate frontend and backend components that are later integrated together.

- **Project Name:** CodeBloggs

- **Short Description:**  
  CodeBloggs is a social media platform designed for programmers and developers to share blog posts, comment on other users’ posts, and like content within the community. The application enables users to create accounts, interact with posts, and manage their profiles.
- **Project Type:**  
  MERN Stack Web Application (MongoDB, Express, React, Node.js)

---

## Goal and Scope

### Goal

The goal of this project is to build a functional social media platform for developers where users can register, log in, create posts, comment on posts, and like content. The system must allow users to view posts from other users, manage their personal information, and interact with content within a structured community environment.

### In Scope (Build Now)

User registration and login system

Session management for authenticated users

Base application layout (Header, Navbar, Main content area)

Home page displaying user information and user posts

Bloggs section displaying posts from all users

Network section displaying user cards

Ability to create posts through a Post Modal

Ability to like posts

Ability to comment on posts

Admin page placeholder (basic layout only)

Backend APIs for users, posts, comments, and sessions

MongoDB schemas for User, Post, Comment, and Session

Integration of frontend React components with backend APIs

### Out of Scope (Do NOT Build)

Real-time messaging or chat systems

Notifications or email systems

Advanced admin tools or moderation systems

Image uploads or media hosting

Advanced search or filtering systems

Recommendation algorithms or feed ranking systems

Third-party authentication (Google, GitHub, etc.)

Mobile applications or native apps

Any features not defined in the business document or wireframes

---

## Users and Use Cases

Guest (Not Logged In): Can view the login page and register a new account. Guests must create an account or log in before accessing the main application.

Registered User: Can log in, view their profile information, create posts, view posts from other users, comment on posts, and like posts. Users can also navigate between the Home, Bloggs, and Network sections of the platform.

Admin User: Has the same capabilities as a registered user but can also access the Admin section of the application, which contains administrative management tools for users and content.
---

## Feature Index (Links Only)

ai_feature_user_registration.md

ai_feature_user_login.md

ai_feature_session_management.md

ai_feature_application_layout.md

ai_feature_home_page.md

ai_feature_bloggs_feed.md

ai_feature_network_users.md

ai_feature_create_post_modal.md

ai_feature_like_post.md

ai_feature_comment_system.md

ai_feature_admin_page.md

ai_feature_user_profile.md

---

## Pages / Screens / Routes (Project Map)

/login — Login page where existing users authenticate to access the application.

/register — Registration page where new users create an account.

/home — Main dashboard displaying user profile information and a list of posts created by the logged-in user.

/bloggs — Feed displaying posts from all users, sorted by most recent.

/network — Page showing a list of user cards representing members of the platform.

/admin — Admin dashboard available only to users with admin privileges. Contains management cards for users and content.

## Modal / Overlay

post-modal — A modal window that appears when a logged-in user clicks the Post button. Allows the user to create and submit a new post. Closes when user clicks outside the modal.

## Global Layout Components

header — Always visible at the top; contains the logo (links to /home), post button, and user menu with logout and account settings options.

navbar — Left side navigation with links to Home, Bloggs, Network, and Admin (admin only). Active link is highlighted.

main — Main content container where routed components are displayed.

## Backend API Endpoints

Authentication & Sessions:
- `POST /login` — Authenticate user with email and password; returns session token and user details
- `POST /register` — Create new user account with email, password, first_name, last_name, birthdate, occupation, location; auto-sets auth_level to 'basic'
- `POST /logout` — Clear user session

Users:
- `GET /user/:id` — Retrieve user profile information
- `GET /users` — Retrieve all users for Network page

Posts:
- `GET /posts` — Get all posts from all users, sorted by most recent first
- `GET /posts/user/:id` — Get posts created by a specific user
- `POST /posts` — Create a new post (requires user_id and content)
- `POST /posts/:postId/like` — Like a post
- `POST /posts/:postId/comment` — Add a comment to a post

---

## Data and Models (Simple)

**Database:** MongoDB (Module09-10)

**Collections:**

**Users**
- user_id (unique identifier)
- first_name (string, required, max 50 chars)
- last_name (string, required, max 50 chars)
- email (string, required, unique, valid format)
- password (string, required, hashed)
- birthday (date, required)
- occupation (string, required, max 50 chars)
- location (string, required, max 50 chars)
- status (string, optional)
- auth_level (string: 'basic' or 'admin', default 'basic')

**Posts**
- post_id (unique identifier)
- user_id (reference to user who created post)
- content (string, post message)
- timestamp (date, when post was created)
- likes (number, count of likes)
- comments (array of comment references)

**Comments**
- comment_id (unique identifier)
- post_id (reference to post being commented on)
- user_id (reference to user who commented)
- content (string, comment text)
- timestamp (date, when comment was created)

**Sessions**
- session_token (unique identifier, sent to client for auth)
- user_id (reference to logged-in user)
- created_at (timestamp)

---

## Tech Stack and Tools

> This section tells the AI **which technologies are allowed and expected**.
>
> It prevents the AI from:
>
> - Using the wrong framework
> - Introducing advanced or unknown tools
> - Mixing incompatible technologies

### Frontend
React (JavaScript)

HTML

CSS

React Router (for client-side routing)

### Backend

Node.js

Express.js (REST API server)

### Database (if any)

MongoDB

### Tools / Libraries

Mongoose (MongoDB object modeling)

Fetch API (for communicating with backend APIs)

Postman (for testing API endpoints during development)

Git and GitHub (version control and collaboration)

DiffMerge (for resolving merge conflicts when collaborating)

---

## Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary | Purple | #8D88EA |
| Primary Hover | Dark Purple | #6C63D9 |
| Accent | Teal | #2ED3B7 |
| Background | Light Gray | #F6F7FF |
| Text / Dark UI | Navy | #1F2340 |
| Borders | Soft Gray | #E3E6F5 |

---

## Repository Structure

/client — React frontend application

/client/src — Main source folder for the React app

/client/src/components — Reusable UI components (Header, Navbar, Post Card, User Card, etc.)

/client/src/pages — Page-level components (Login, Register, Home, Bloggs, Network, Admin)

/client/src/services — API request logic used to communicate with the backend

/client/src/styles — Global styles and CSS files

/server — Backend Node.js and Express application

/server/routes — API route definitions (users, posts, comments, sessions)

/server/controllers — Logic for handling API requests

/server/db/schemas — MongoDB schemas (User, Post, Comment, Session)

/server/db — Database connection and configuration

/server/middleware — Authentication and request validation middleware

/docs — Project documentation and AI instruction files

/docs/ai_features — Individual AI feature specification files

---

## Rules for the AI

Use junior-friendly, easy-to-read code.

Follow the MERN stack only (MongoDB, Express, React, Node.js).

Do not introduce new frameworks, libraries, or tools that are not listed in the tech stack.

Do not add features that are not listed in the business document or feature index.

Keep solutions simple and maintainable.

Reuse existing files and components when possible instead of creating new ones.

Follow the repository structure defined in this document.

When suggesting code, provide short explanations of what changed and why.
---

## How to Run / Test the Project

1. Install Dependencies

Install dependencies for both the frontend and backend.

cd client
npm install

cd ../server
npm install
2. Start the Backend Server
cd server
npm start

The backend server should start and expose the API at http://localhost:5000 (or configured port).

3. Start the Frontend Application
cd client
npm start

This launches the React application in development mode at http://localhost:3000.

4. Open the Application

Open the browser and navigate to:

http://localhost:3000

5. Test API Endpoints

Use Postman to test backend API routes:
- User registration: POST /register
- User login: POST /login
- Get all posts: GET /posts
- Create post: POST /posts
- Like post: POST /posts/:postId/like
- Add comment: POST /posts/:postId/comment

---

## Definition of Done

Project runs without server or client errors

Users can register and log in

Session tokens are created and validated

Authenticated users can create posts

Users can like posts

Users can comment on posts

Home page displays user information and user's posts with calculated fields (post count, last post date)

Bloggs page displays all posts from all users sorted by most recent

Network page displays a list of all user cards

Admin page is visible only for admin users

Post Modal closes when clicking outside

Frontend and backend communicate correctly through APIs

Code is organized, readable, and follows the repository structure
