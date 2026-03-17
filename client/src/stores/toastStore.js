import { Subject, merge } from 'rxjs';
import { map, scan, tap, delay } from 'rxjs/operators';

/**
 * ToastStore - RxJS-based reactive toast notification management
 * Uses Subjects and operators for efficient notification handling
 */

// Subject for adding toasts
const addToast$ = new Subject();
// Subject for removing toasts
const removeToast$ = new Subject();

// Store toast messages with unique IDs
let toastId = 0;

/**
 * Toast state - accumulates and removes toasts
 */
export const toasts$ = merge(
  addToast$.pipe(
    map((toast) => ({
      action: 'add',
      toast: {
        ...toast,
        id: toastId++,
      },
    }))
  ),
  removeToast$.pipe(
    map((id) => ({
      action: 'remove',
      id,
    }))
  )
).pipe(
  scan((toasts, { action, toast, id }) => {
    if (action === 'add') {
      // Auto-remove toast after 5 seconds
      setTimeout(() => removeToast$.next(toast.id), toast.duration || 5000);
      return [...toasts, toast];
    } else if (action === 'remove') {
      return toasts.filter((t) => t.id !== id);
    }
    return toasts;
  }, [])
);

/**
 * Show success toast
 */
export const showSuccessToast = (message, duration = 5000) => {
  addToast$.next({
    type: 'success',
    message,
    duration,
  });
};

/**
 * Show error toast
 */
export const showErrorToast = (message, duration = 5000) => {
  addToast$.next({
    type: 'error',
    message,
    duration,
  });
};

/**
 * Show info toast
 */
export const showInfoToast = (message, duration = 5000) => {
  addToast$.next({
    type: 'info',
    message,
    duration,
  });
};

/**
 * Show warning toast
 */
export const showWarningToast = (message, duration = 5000) => {
  addToast$.next({
    type: 'warning',
    message,
    duration,
  });
};

/**
 * Remove specific toast by ID
 */
export const dismissToast = (id) => {
  removeToast$.next(id);
};

/**
 * Clear all toasts
 */
export const clearAllToasts = () => {
  // This will need to be handled via a specific action
  addToast$.pipe(
    tap(() => {
      // Clear implementation
    })
  ).toPromise();
};
