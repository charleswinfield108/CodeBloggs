import { BehaviorSubject, Subject } from 'rxjs';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';

/**
 * UserStore - RxJS-based reactive user state management
 * Manages user data, search, and updates with reactive streams
 */

// BehaviorSubjects for user state
export const users$ = new BehaviorSubject({});
export const usersLoading$ = new BehaviorSubject(false);
export const usersError$ = new BehaviorSubject(null);
export const userSearch$ = new BehaviorSubject('');
export const selectedUser$ = new BehaviorSubject(null);

// Subject for triggering actions
export const fetchUsersAction$ = new Subject();
export const updateUserAction$ = new Subject();
export const deleteUserAction$ = new Subject();
export const searchUsersAction$ = new Subject();

/**
 * Fetch all users
 */
export const fetchAllUsers = async (limit = 1000) => {
  try {
    usersLoading$.next(true);
    usersError$.next(null);

    const response = await fetch(`http://localhost:5050/users?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    
    // Convert array to object indexed by user ID for efficient lookups
    const usersMap = {};
    (data.data || []).forEach((user) => {
      usersMap[user._id] = user;
    });
    
    users$.next(usersMap);
  } catch (error) {
    console.error('Error fetching users:', error);
    usersError$.next(error.message);
  } finally {
    usersLoading$.next(false);
  }
};

/**
 * Fetch user by ID
 */
export const fetchUserById = async (userId) => {
  try {
    usersLoading$.next(true);
    usersError$.next(null);

    const response = await fetch(`http://localhost:5050/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    
    // Update the user in the store
    const currentUsers = users$.value;
    currentUsers[userId] = data.data;
    users$.next({ ...currentUsers });
    
    selectedUser$.next(data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    usersError$.next(error.message);
  } finally {
    usersLoading$.next(false);
  }
};

/**
 * Update user
 */
export const updateUser = async (userId, updates) => {
  try {
    usersLoading$.next(true);
    usersError$.next(null);

    const response = await fetch(`http://localhost:5050/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    const data = await response.json();
    
    // Update user in the store
    const currentUsers = users$.value;
    currentUsers[userId] = data.data;
    users$.next({ ...currentUsers });
    
    if (selectedUser$.value?._id === userId) {
      selectedUser$.next(data.data);
    }
    
    return data.data;
  } catch (error) {
    console.error('Error updating user:', error);
    usersError$.next(error.message);
  } finally {
    usersLoading$.next(false);
  }
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
  try {
    usersLoading$.next(true);
    usersError$.next(null);

    const response = await fetch(`http://localhost:5050/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    // Remove user from the store
    const currentUsers = users$.value;
    delete currentUsers[userId];
    users$.next({ ...currentUsers });
  } catch (error) {
    console.error('Error deleting user:', error);
    usersError$.next(error.message);
  } finally {
    usersLoading$.next(false);
  }
};

/**
 * Search users
 */
export const searchUsers = (searchTerm) => {
  userSearch$.next(searchTerm);
};

/**
 * Selectors - derived state from users$
 */
export const selectUserById$ = (userId) =>
  users$.pipe(
    map((usersMap) => usersMap[userId] || null),
    distinctUntilChanged()
  );

export const selectAllUsers$ = users$.pipe(
  map((usersMap) => Object.values(usersMap)),
  distinctUntilChanged((prev, curr) => 
    JSON.stringify(prev) === JSON.stringify(curr)
  )
);

export const selectUserCount$ = users$.pipe(
  map((usersMap) => Object.keys(usersMap).length),
  distinctUntilChanged()
);

export const selectFilteredUsers$ = (searchTerm$) =>
  users$.pipe(
    map((usersMap) => {
      const search = searchTerm$.toLowerCase();
      return Object.values(usersMap).filter((user) =>
        `${user.first_name} ${user.last_name} ${user.email}`
          .toLowerCase()
          .includes(search)
      );
    })
  );
