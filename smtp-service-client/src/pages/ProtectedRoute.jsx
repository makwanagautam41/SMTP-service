// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading)
    return <div className="text-center mt-10">Checking session...</div>;

  // If not logged in, redirect to login page
  if (!user) return <Navigate to="/login" replace />;

  // Else, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
