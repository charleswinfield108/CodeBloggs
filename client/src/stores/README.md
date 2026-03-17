# RxJS State Management Implementation

This directory contains the reactive state management system for CodeBloggs using RxJS and react-rxjs patterns.

## Overview

The state management system is built on RxJS observables and BehaviorSubjects, providing a reactive, scalable approach to managing application state. This replaces the context-based approach with efficient, observable-driven state updates.

## Architecture

### Core Stores

#### 1. **sessionStore.js**
Manages user session and authentication state.

**Observables:**
- `session$` - Current user session (BehaviorSubject)
- `loading$` - Session loading state
- `isOnline$` - User online status
- `error$` - Session errors

**Key Actions:**
- `initializeSession()` - Initialize session from cookies
- `login(sessionData, token)` - Set user session
- `logout()` - Clear session
- `updateSession(updates)` - Update session data
- `setOnlineStatus(isOnline)` - Set online status

**Selectors:**
- `selectUserId$` - Get current user ID
- `selectUserRole$` - Get user auth level
- `selectIsAuthenticated$` - Check if user is logged in
- `selectSessionData$` - Get full session data

#### 2. **postStore.js**
Manages all post-related state.

**Observables:**
- `posts$` - Array of all posts
- `likedPosts$` - Set of liked post IDs
- `postLoading$` - Loading state
- `postError$` - Post errors
- `currentPost$` - Currently selected post

**Key Actions:**
- `fetchAllPosts(userId)` - Fetch posts
- `createPost(postData)` - Create new post
- `updatePost(postId, updates)` - Update post
- `deletePost(postId)` - Delete post
- `toggleLikePost(postId, userId)` - Like/unlike post
- `fetchLikedPosts(userId)` - Fetch user's liked posts

**Selectors:**
- `selectPostCount$` - Get post count
- `selectPostsByUserId$` - Filter posts by user
- `selectPostById$` - Get single post
- `selectIsPostLiked$` - Check if post is liked

#### 3. **toastStore.js**
Manages toast notifications.

**Observables:**
- `toasts$` - Array of active toasts

**Key Actions:**
- `showSuccessToast(message, duration)` - Show success toast
- `showErrorToast(message, duration)` - Show error toast
- `showInfoToast(message, duration)` - Show info toast
- `showWarningToast(message, duration)` - Show warning toast
- `dismissToast(id)` - Dismiss specific toast
- `clearAllToasts()` - Clear all toasts

#### 4. **userStore.js**
Manages user data and user management state.

**Observables:**
- `users$` - Map of all users indexed by ID
- `usersLoading$` - Loading state
- `usersError$` - User errors
- `userSearch$` - Search term
- `selectedUser$` - Currently selected user

**Key Actions:**
- `fetchAllUsers(limit)` - Fetch all users
- `fetchUserById(userId)` - Fetch single user
- `updateUser(userId, updates)` - Update user
- `deleteUser(userId)` - Delete user
- `searchUsers(searchTerm)` - Set search term

**Selectors:**
- `selectUserById$` - Get user by ID
- `selectAllUsers$` - Get all users as array
- `selectUserCount$` - Get user count
- `selectFilteredUsers$` - Filter users by search term

## Custom Hooks

### useStores.js

Custom React hooks that bridge RxJS observables and React components:

#### `useObservable(observable$, initialValue)`
Generic hook to subscribe to any observable.

```jsx
const data = useObservable(dataStore$, null);
```

#### `useSession()`
Access session state and auth info.

```jsx
const { session, loading, isOnline, error } = useSession();
```

#### `useToasts()`
Access active toasts.

```jsx
const toasts = useToasts();
```

#### `usePosts()`
Access post state.

```jsx
const { posts, likedPosts, loading, error } = usePosts();
```

#### `useUsers()`
Access user state.

```jsx
const { users, loading, error } = useUsers();
```

#### `useObservableSelector(selector$, initialValue)`
Subscribe to a derived/selector observable.

```jsx
const userId = useObservableSelector(selectUserId$, null);
```

## Usage Examples

### Example 1: Using Session Store in a Component

```jsx
import { useSession, initializeSession, logout } from '../stores/sessionStore';
import { useObservable } from '../stores/useStores';

function MyComponent() {
  const { session, loading } = useSession();

  useEffect(() => {
    initializeSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Welcome, {session?.first_name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Example 2: Using Post Store

```jsx
import { usePosts, fetchAllPosts, toggleLikePost } from '../stores/postStore';
import { showSuccessToast } from '../stores/toastStore';

function PostsList() {
  const { posts, likedPosts, loading } = usePosts();
  const { session } = useSession();

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handleLike = (postId) => {
    toggleLikePost(postId, session.id);
    showSuccessToast('Post liked!');
  };

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <button 
            onClick={() => handleLike(post._id)}
            style={{ color: likedPosts.has(post._id) ? 'red' : 'gray' }}
          >
            ❤️
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Using Selector Observables

```jsx
import { selectPostsByUserId$, selectIsPostLiked$ } from '../stores/postStore';
import { useObservableSelector } from '../stores/useStores';

function UserPosts({ userId }) {
  const userPosts = useObservableSelector(
    selectPostsByUserId$(userId),
    []
  );

  return (
    <div>
      {userPosts.map((post) => (
        <div key={post._id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## Benefits of RxJS State Management

1. **Reactive Updates** - State changes automatically propagate to components
2. **Efficiency** - Only affected components re-render
3. **Composability** - Easy to combine and derive state with operators
4. **Performance** - RxJS handles subscriptions and memory management
5. **Predictability** - Unidirectional data flow
6. **Scalability** - Easy to add new stores and features

## RxJS Operators Used

- `map()` - Transform observable values
- `switchMap()` - Switch between observables
- `tap()` - Perform side effects
- `catchError()` - Handle errors
- `startWith()` - Provide initial value
- `debounceTime()` - Debounce rapid emissions
- `distinctUntilChanged()` - Emit only unique values
- `scan()` - Accumulate state changes
- `filter()` - Filter values
- `merge()` - Combine multiple sources

## Migration from Context to Stores

When migrating existing context-based components:

1. Replace `useContext()` with store hooks:
   ```jsx
   // Before
   const { session } = useContext(SessionContext);
   
   // After
   const { session } = useSession();
   ```

2. Replace context actions with store actions:
   ```jsx
   // Before
   dispatch({ type: 'LOGIN', payload: data });
   
   // After
   login(data, token);
   ```

3. Subscribe to derived state with selectors:
   ```jsx
   // Before
   const userId = session?.id;
   
   // After
   const userId = useObservableSelector(selectUserId$, null);
   ```

## Best Practices

1. **Use Selectors** - Always use selector observables for derived state
2. **Leverage distinctUntilChanged()** - Prevent unnecessary updates
3. **Unsubscribe** - Custom hooks automatically unsubscribe
4. **Error Handling** - Always check error$ observables
5. **Lazy Loading** - Load data only when needed
6. **Memory Management** - Properly clean up subscriptions

## Future Enhancements

- [ ] Add Redux DevTools integration for debugging
- [ ] Implement time-travel debugging
- [ ] Add offline support with RxJS
- [ ] Create reusable CRUD store factory
- [ ] Add persistence middleware
- [ ] Implement reactive forms with RxJS validators

## Resources

- [RxJS Documentation](https://rxjs.dev/)
- [react-rxjs Documentation](https://react-rxjs.org/)
- [RxJS Best Practices](https://rxjs.dev/guide/operators)
