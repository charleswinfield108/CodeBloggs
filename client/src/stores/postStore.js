import { BehaviorSubject, Subject, interval } from 'rxjs';
import { map, switchMap, tap, catchError, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * PostStore - RxJS-based reactive post state management
 * Manages post data, likes, and updates with reactive streams
 */

// BehaviorSubjects for post state
export const posts$ = new BehaviorSubject([]);
export const likedPosts$ = new BehaviorSubject(new Set());
export const postLoading$ = new BehaviorSubject(false);
export const postError$ = new BehaviorSubject(null);
export const currentPost$ = new BehaviorSubject(null);

// Subject for triggering actions
export const fetchPostsAction$ = new Subject();
export const createPostAction$ = new Subject();
export const updatePostAction$ = new Subject();
export const deletePostAction$ = new Subject();
export const likePostAction$ = new Subject();

/**
 * Fetch all posts
 */
export const fetchAllPosts = async (userId = null) => {
  try {
    postLoading$.next(true);
    postError$.next(null);

    const url = userId 
      ? `http://localhost:5050/posts?user_id=${userId}` 
      : 'http://localhost:5050/posts';

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    posts$.next(data.data || []);
  } catch (error) {
    console.error('Error fetching posts:', error);
    postError$.next(error.message);
  } finally {
    postLoading$.next(false);
  }
};

/**
 * Create a new post
 */
export const createPost = async (postData) => {
  try {
    postLoading$.next(true);
    postError$.next(null);

    const response = await fetch('http://localhost:5050/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    const newPost = await response.json();
    
    // Add new post to the beginning of the posts array
    const currentPosts = posts$.value;
    posts$.next([newPost.data, ...currentPosts]);
    
    return newPost.data;
  } catch (error) {
    console.error('Error creating post:', error);
    postError$.next(error.message);
  } finally {
    postLoading$.next(false);
  }
};

/**
 * Update an existing post
 */
export const updatePost = async (postId, updates) => {
  try {
    postLoading$.next(true);
    postError$.next(null);

    const response = await fetch(`http://localhost:5050/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update post');
    }

    const updatedPost = await response.json();
    
    // Update post in the posts array
    const currentPosts = posts$.value;
    const updatedPosts = currentPosts.map((post) =>
      post._id === postId ? updatedPost.data : post
    );
    posts$.next(updatedPosts);
    
    return updatedPost.data;
  } catch (error) {
    console.error('Error updating post:', error);
    postError$.next(error.message);
  } finally {
    postLoading$.next(false);
  }
};

/**
 * Delete a post
 */
export const deletePost = async (postId) => {
  try {
    postLoading$.next(true);
    postError$.next(null);

    const response = await fetch(`http://localhost:5050/posts/${postId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    // Remove post from the posts array
    const currentPosts = posts$.value;
    posts$.next(currentPosts.filter((post) => post._id !== postId));
  } catch (error) {
    console.error('Error deleting post:', error);
    postError$.next(error.message);
  } finally {
    postLoading$.next(false);
  }
};

/**
 * Like/Unlike a post
 */
export const toggleLikePost = async (postId, userId) => {
  try {
    const currentLiked = likedPosts$.value;
    const isLiked = currentLiked.has(postId);

    // Optimistic update
    const newLiked = new Set(currentLiked);
    if (isLiked) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    likedPosts$.next(newLiked);

    const endpoint = isLiked 
      ? `http://localhost:5050/posts/${postId}/unlike`
      : `http://localhost:5050/posts/${postId}/like`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      // Revert optimistic update on error
      likedPosts$.next(currentLiked);
      throw new Error('Failed to like/unlike post');
    }

    return true;
  } catch (error) {
    console.error('Error toggling like:', error);
    postError$.next(error.message);
  }
};

/**
 * Fetch liked posts for a user
 */
export const fetchLikedPosts = async (userId) => {
  try {
    const response = await fetch(`http://localhost:5050/users/${userId}/liked-posts`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch liked posts');
    }

    const data = await response.json();
    const likedPostIds = new Set(data.data?.map((post) => post._id) || []);
    likedPosts$.next(likedPostIds);
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    postError$.next(error.message);
  }
};

/**
 * Selectors - derived state from posts$
 */
export const selectPostCount$ = posts$.pipe(
  map((posts) => posts.length)
);

export const selectPostsByUserId$ = (userId) =>
  posts$.pipe(
    map((posts) => posts.filter((post) => post.user_id === userId))
  );

export const selectPostById$ = (postId) =>
  posts$.pipe(
    map((posts) => posts.find((post) => post._id === postId))
  );

export const selectIsPostLiked$ = (postId) =>
  likedPosts$.pipe(
    map((liked) => liked.has(postId)),
    distinctUntilChanged()
  );
