import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <main className="center-page"><p>Loading your workspace…</p></main>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
