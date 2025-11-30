import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import RegisterWithZK from './components/RegisterWithZK';
import RegisterWithZKProof from './components/RegisterWithZKProof';
import AgeVerification from './components/AgeVerification';
import ProtectedRoute from './components/ProtectedRoute';
import ZKDemo from './components/ZKDemo';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected pages */}
        <Route path="/register-zk-proof" element={
          <ProtectedRoute>
            <RegisterWithZKProof />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Pages with navbar */}
        <Route path="/register-zk" element={
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />
            <main className="py-8">
              <RegisterWithZK />
            </main>
          </div>
        } />
        <Route path="/age-verification" element={
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />
            <main className="py-8">
              <AgeVerification />
            </main>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
