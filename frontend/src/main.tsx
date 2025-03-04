import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/auth/login.tsx";
import Registration from "./pages/auth/registration.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="login" element={<Login />} />
      <Route path="registration" element={<Registration />} />
      

      {/* Registered users 
      <Route element={<UserRoutes />}>
        <Route path="profile" element={<Profile />} />
        <Route path="boxes" element={<Boxes />} />
        <Route path="boxes/:boxId/items" element={<Items />} />
        <Route path="labels/:labelId" element={<Labels />} />
      </Route>

      <Route path="admin" element={<AdminRoutes />}>
        <Route path="" element={<Users />} />
        <Route path="users" element={<Users />} />
      </Route>

      <Route path="*" element={<Home />} /> */}
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