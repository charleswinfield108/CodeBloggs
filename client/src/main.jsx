import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Network from "./pages/Network";
import Admin from "./pages/Admin";
import UserManager from "./pages/UserManager";
import ContentManager from "./pages/ContentManager";
import { SessionProvider } from "./context/SessionContext";
import { PostModalProvider } from "./context/PostModalContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Record from "./components/Record";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/blogs",
    element: (
      <ProtectedRoute>
        <Blogs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/network",
    element: (
      <ProtectedRoute>
        <Network />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute>
        <UserManager />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/posts",
    element: (
      <ProtectedRoute>
        <ContentManager />
      </ProtectedRoute>
    ),
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "edit/:id",
        element: <Record />,
      },
      {
        path: "create",
        element: <Record />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <SessionProvider>
      <PostModalProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </PostModalProvider>
    </SessionProvider>
  </React.StrictMode>
);