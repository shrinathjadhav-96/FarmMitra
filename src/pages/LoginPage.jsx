import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sprout, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login, DEMO_USERS } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const role = res.user.role;
      if (role === 'FARMER') navigate('/farmer-dashboard');
      else if (role === 'BUYER') navigate('/buyer-dashboard');
      else if (role === 'ADMIN') navigate('/admin-dashboard');
      else navigate('/');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async (demoUser) => {
    setLoading(true);
    const res = await login(demoUser.email, 'password123');
    setLoading(false);

    if (res.success) {
      if (demoUser.role === 'FARMER') navigate('/farmer-dashboard');
      else if (demoUser.role === 'BUYER') navigate('/buyer-dashboard');
      else if (demoUser.role === 'ADMIN') navigate('/admin-dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-farm-600 text-white p-3 rounded-2xl shadow-lg">
            <Sprout className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-black text-gray-900 tracking-tight">
          Log in to FarmMitra
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          Access your listings, buyer offers, and deals
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100 sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address or Phone
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-farm-600 hover:bg-farm-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Shortcut Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center mb-3">
              Fast Demo Accounts (One-Click Login)
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin(DEMO_USERS[0])}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5"><Sprout className="w-4 h-4 text-emerald-600" /> Demo Farmer (Ramesh)</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </button>
              
              <button
                type="button"
                onClick={() => handleDemoLogin(DEMO_USERS[1])}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4 text-blue-600" /> Demo Buyer (Wholesale Corp)</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin(DEMO_USERS[2])}
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-purple-600" /> Demo Admin</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-farm-700 hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

