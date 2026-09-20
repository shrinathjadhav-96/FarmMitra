import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationBell } from './NotificationBell';
import { Sprout, LogOut, User, Menu, X, ShieldCheck, ShoppingBag, Store } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = (role) => {
    if (role === 'FARMER') return '/farmer-dashboard';
    if (role === 'BUYER') return '/buyer-dashboard';
    if (role === 'ADMIN') return '/admin-dashboard';
    return '/';
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'FARMER':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Sprout className="w-3.5 h-3.5" /> Farmer</span>;
      case 'BUYER':
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5" /> Buyer</span>;
      case 'ADMIN':
        return <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Admin</span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center">
            <Link to={user ? getDashboardPath(user.role) : '/'} className="flex items-center gap-2">
              <div className="bg-farm-600 text-white p-2 rounded-xl shadow-md">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-farm-900 leading-none">FarmMitra</span>
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Kisan Ka Marketplace</span>
              </div>
            </Link>
          </div>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Amazon SNS Notification Bell 🔔 */}
                <NotificationBell />

                {/* Role Badge */}
                {getRoleBadge(user.role)}

                {/* User info */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.location || user.email}</p>
                </div>

                {/* Dashboard Shortcut */}
                <Link
                  to={getDashboardPath(user.role)}
                  className="text-sm font-medium text-farm-700 hover:text-farm-800 bg-farm-50 hover:bg-farm-100 px-3 py-2 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-farm-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-farm-600 hover:bg-farm-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button & notification bell */}
          <div className="flex items-center gap-2 md:hidden">
            {user && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-3">
          {user ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                {getRoleBadge(user.role)}
              </div>
              <Link
                to={getDashboardPath(user.role)}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center font-bold bg-farm-600 text-white py-2.5 rounded-xl"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-center font-medium text-red-600 bg-red-50 py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center font-semibold text-gray-800 bg-gray-100 py-2.5 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center font-bold bg-farm-600 text-white py-2.5 rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
