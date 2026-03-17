import { useEffect, useState } from 'react';

/**
 * Custom hooks for integrating RxJS stores with React components
 * These hooks subscribe to observables and automatically update component state
 */

/**
 * useObservable - Generic hook to subscribe to an observable
 * @param {Observable} observable$ - RxJS observable to subscribe to
 * @param {any} initialValue - Initial value while observable hasn't emitted
 * @returns {any} - Current value from the observable
 */
export const useObservable = (observable$, initialValue) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const subscription = observable$.subscribe((newValue) => {
      setValue(newValue);
    });

    return () => subscription.unsubscribe();
  }, [observable$]);

  return value;
};

/**
 * useSession - Hook to access session state
 */
export const useSession = () => {
  const { session$, loading$, isOnline$, error$ } = require('../stores/sessionStore');
  
  const session = useObservable(session$, null);
  const loading = useObservable(loading$, true);
  const isOnline = useObservable(isOnline$, false);
  const error = useObservable(error$, null);

  return { session, loading, isOnline, error };
};

/**
 * useToasts - Hook to access toast notifications
 */
export const useToasts = () => {
  const { toasts$ } = require('../stores/toastStore');
  const toasts = useObservable(toasts$, []);
  return toasts;
};

/**
 * usePosts - Hook to access post state
 */
export const usePosts = () => {
  const { posts$, likedPosts$, postLoading$, postError$ } = require('../stores/postStore');
  
  const posts = useObservable(posts$, []);
  const likedPosts = useObservable(likedPosts$, new Set());
  const loading = useObservable(postLoading$, false);
  const error = useObservable(postError$, null);

  return { posts, likedPosts, loading, error };
};

/**
 * useUsers - Hook to access user state
 */
export const useUsers = () => {
  const { users$, usersLoading$, usersError$ } = require('../stores/userStore');
  
  const users = useObservable(users$, {});
  const loading = useObservable(usersLoading$, false);
  const error = useObservable(usersError$, null);

  return { users, loading, error };
};

/**
 * useObservableSelector - Hook to subscribe to a derived/selector observable
 * @param {Observable} selector$ - Selector observable
 * @param {any} initialValue - Initial value
 * @returns {any} - Current value from selector
 */
export const useObservableSelector = (selector$, initialValue) => {
  return useObservable(selector$, initialValue);
};
