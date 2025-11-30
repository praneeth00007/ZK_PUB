import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAgeVerification = false }) {
  const { user, token } = useAuth();

  // If no token, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If age verification is required but user is not verified
  if (requireAgeVerification && !user.isAgeVerified) {
    return <Navigate to="/register-zk-proof" replace />;
  }

  return children;
}
