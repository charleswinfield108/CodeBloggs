# Challenging Concepts in CodeBloggs

This document outlines 3 challenging concepts encountered during the CodeBloggs project development.

---

## 1. Remembering to Merge Feat Branch With Dev Branch
cd
**Purpose in the Project:**
Ensures that all feature development work is properly integrated into the main development branch before merging to production, maintaining code consistency and preventing integration issues across the team.

**Why It Was Challenging:**
Managing multiple feature branches simultaneously while keeping track of which branches need to be merged created workflow confusion. It was easy to lose track of work in progress, accidentally commit to the wrong branch, or forget to create pull requests before merging. This required establishing clear Git conventions, remembering the exact merge sequence, and communicating status across the team.

**Usage Location:**
- Git repository workflow throughout the project
- All branches in [CodeBloggs](.) repository

---

## 2. Making Sure That Changes Were Pushed From Local to GitHub

**Purpose in the Project:**
Ensures that all local development work is backed up and synchronized with the remote repository, preventing loss of code and enabling team collaboration and continuous integration.

**Why It Was Challenging:**
Remembering to push commits to GitHub after completing work was frequently overlooked, especially when rapidly switching between tasks or working on multiple features. Without pushing, teammates couldn't see updates, CI/CD pipelines wouldn't run, and there was risk of losing work if the local machine failed. Establishing the discipline to consistently push and verify successful uploads required habit formation and process discipline.

**Usage Location:**
- Git remote operations throughout the project
- All remote commits in [CodeBloggs](.) repository on GitHub

---

## 3. Creating the Login Status Feature

**Purpose in the Project:**
Provides persistent authentication state that tracks whether a user is logged in, displays their status across the application, and automatically handles session validation to keep the user logged in across page refreshes.

**Why It Was Challenging:**
Implementing login status required coordinating between frontend state management (Context API), backend session handling, secure token storage, and maintaining state consistency when the page refreshes or user navigates between routes. Required understanding of authentication flows, secure cookie handling, session validation, and React context patterns to ensure the login state persists without exposing sensitive data.

**Usage Location:**
- [client/src/context/SessionContext.jsx](client/src/context/SessionContext.jsx) — Session state management and login status tracking
- [client/src/components/ProtectedRoute.jsx](client/src/components/ProtectedRoute.jsx) — Route protection based on login status
- [server/controllers/session.controller.js](server/controllers/session.controller.js) — Backend session validation and login/logout endpoints
