import { BehaviorSubject, Subject, interval } from 'rxjs';
import { map, switchMap, tap, catchError, startWith, debounceTime } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * SessionStore - RxJS-based reactive session state management
 * Uses observables for real-time session tracking and updates
 * Replaces context-based approach with reactive streams
 */

// Cookie utility functions
const setCookie = (name, value, days = 1) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const isSecure = window.location.protocol === 'https:' ? ';secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/${isSecure}`;
};

const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

// BehaviorSubjects for session state management
export const session$ = new BehaviorSubject(null);
export const loading$ = new BehaviorSubject(true);
export const isOnline$ = new BehaviorSubject(false);
export const error$ = new BehaviorSubject(null);

// Subject for triggering actions
export const loginAction$ = new Subject();
export const logoutAction$ = new Subject();
export const initializeAction$ = new Subject();

/**
 * Initialize session from cookies and localStorage
 * Validates token with backend
 */
export const initializeSession = async () => {
  try {
    loading$.next(true);
    const tokenFromCookie = getCookie("session_token");
    
    if (tokenFromCookie) {
      const validateResponse = await fetch(
        `http://localhost:5050/validate_token?token=${encodeURIComponent(tokenFromCookie)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (validateResponse.ok) {
        const validateData = await validateResponse.json();
        if (validateData.status === "ok" && validateData.data.valid) {
          const storedSession = localStorage.getItem("session");
          if (storedSession) {
            const sessionData = JSON.parse(storedSession);
            session$.next(sessionData);
            isOnline$.next(sessionData?.isOnline ?? true);
            error$.next(null);
          }
        } else {
          localStorage.removeItem("session");
          deleteCookie("session_token");
          session$.next(null);
          error$.next("Session expired");
        }
      } else {
        localStorage.removeItem("session");
        deleteCookie("session_token");
        session$.next(null);
        error$.next("Token validation failed");
      }
    }
  } catch (err) {
    console.error("Session initialization error:", err);
    error$.next(err.message);
  } finally {
    loading$.next(false);
  }
};

/**
 * Login action - sets session and token
 */
export const login = (sessionData, token) => {
  try {
    localStorage.setItem("session", JSON.stringify(sessionData));
    setCookie("session_token", token);
    session$.next(sessionData);
    isOnline$.next(sessionData?.isOnline ?? true);
    error$.next(null);
  } catch (err) {
    console.error("Login error:", err);
    error$.next(err.message);
  }
};

/**
 * Logout action - clears session and token
 */
export const logout = () => {
  try {
    localStorage.removeItem("session");
    deleteCookie("session_token");
    session$.next(null);
    isOnline$.next(false);
    error$.next(null);
  } catch (err) {
    console.error("Logout error:", err);
    error$.next(err.message);
  }
};

/**
 * Update session state
 */
export const updateSession = (updates) => {
  const currentSession = session$.value;
  if (currentSession) {
    const updatedSession = { ...currentSession, ...updates };
    session$.next(updatedSession);
    localStorage.setItem("session", JSON.stringify(updatedSession));
  }
};

/**
 * Set online status reactively
 */
export const setOnlineStatus = (isOnline) => {
  isOnline$.next(isOnline);
  updateSession({ isOnline });
};

/**
 * Selectors - derived state from session$
 */
export const selectUserId$ = session$.pipe(
  map((session) => session?.id || null)
);

export const selectUserRole$ = session$.pipe(
  map((session) => session?.auth_level || null)
);

export const selectIsAuthenticated$ = session$.pipe(
  map((session) => !!session)
);

export const selectSessionData$ = session$.pipe(
  map((session) => session || {})
);
