import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/login/Login";
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/auth/login/Register";
import Home from "../pages/main/home/Home";

function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route path="home" element={<Home />} />
        </Route>

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterProvider;
