import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Home from "./pages/Home";
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
    path: "/home",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
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