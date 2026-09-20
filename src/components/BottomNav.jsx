import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Sprout, ShoppingBag, ShieldCheck, User, PlusCircle, Search } from 'lucide-react';

export const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getDashboardPath = () => {
    if (user.role === 'FARMER') return '/farmer-dashboard';
    if (user.role === 'BUYER') return '/buyer-dashboard';
    if (user.role === 'ADMIN') return '/admin-dashboard';
    return '/';
  };

  const dashboardPath = getDashboardPath();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-50 px-6 py-2 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Main Dashboard Icon */}
        <Link
          to={dashboardPath}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            isActive(dashboardPath)
              ? 'text-farm-700 bg-farm-50 font-bold scale-105'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* Primary Role Action */}
        {user.role === 'FARMER' && (
          <button
            onClick={() => alert('Crop listing creation form will be enabled in Phase 2!')}
            className="flex flex-col items-center justify-center bg-farm-600 text-white w-12 h-12 rounded-2xl shadow-lg shadow-farm-600/30 -mt-6 transform active:scale-95 transition-all"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        )}

        {user.role === 'BUYER' && (
          <button
            onClick={() => alert('Crop discovery and search engine will be enabled in Phase 3!')}
            className="flex flex-col items-center justify-center bg-blue-600 text-white w-12 h-12 rounded-2xl shadow-lg shadow-blue-600/30 -mt-6 transform active:scale-95 transition-all"
          >
            <Search className="w-6 h-6" />
          </button>
        )}

        {user.role === 'ADMIN' && (
          <Link
            to="/admin-dashboard"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              isActive('/admin-dashboard')
                ? 'text-purple-700 bg-purple-50 font-bold scale-105'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px]">Admin</span>
          </Link>
        )}

        {/* Profile / Account link */}
        <div className="flex flex-col items-center gap-1 py-1 px-3 text-gray-400">
          <div className="w-5 h-5 rounded-full bg-farm-100 text-farm-800 text-[10px] font-black flex items-center justify-center uppercase">
            {user.name?.charAt(0) || 'U'}
          </div>
          <span className="text-[10px] truncate max-w-[50px]">{user.role}</span>
        </div>
      </div>
    </nav>
  );
};

