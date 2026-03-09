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
import { SessionProvider } from "./context/SessionContext";
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
    element: <Home />,
  },
  {
    path: "/blogs",
    element: <Blogs />,
  },
  {
    path: "/network",
    element: <Network />,
  },
  {
    path: "/admin",
    element: <Admin />,
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
      <RouterProvider router={router} />
    </SessionProvider>
  </React.StrictMode>
);