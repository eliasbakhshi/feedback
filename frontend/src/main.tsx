import App from "./App.jsx";
import "./App.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import { Route, RouterProvider, createRoutesFromElements, createBrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Login from "./pages/auth/Login.tsx";
import Registration from "./pages/auth/Registration.tsx";
import UserRoutes from "./pages/user/UserRoutes.tsx";
import Account from "./pages/user/Account.tsx";
import ErrorPage from "./pages/Error404.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Registration />} />
      <Route element={<UserRoutes />}>
        <Route path="account" element={<Account />} />
      </Route>
      <Route path="error404" element={<ErrorPage />} />
    </Route>,
  ),
);

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </GoogleOAuthProvider>
    </StrictMode>,
  );
}