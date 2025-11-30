import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-300 transition-colors">
          ZK Pub
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-white hover:text-blue-300 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <span className="text-gray-300 text-sm">
                Hi, {user.name || user.email}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-white hover:text-blue-300 transition-colors font-medium"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


