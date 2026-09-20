import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BUYER_TYPES } from '../services/userService';
import { Sprout, ShoppingBag, ShieldCheck, UserPlus, Building2 } from 'lucide-react';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') || 'FARMER').toUpperCase();

  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Bidar, Karnataka');
  const [role, setRole] = useState(initialRole);
  const [buyerType, setBuyerType] = useState('Wholesaler');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register({
      name,
      email,
      password,
      phone,
      role,
      buyerType: role === 'BUYER' ? buyerType : undefined,
      location
    });

    setLoading(false);

    if (res.success) {
      if (role === 'FARMER') navigate('/farmer-dashboard');
      else if (role === 'BUYER') navigate('/buyer-dashboard');
      else if (role === 'ADMIN') navigate('/admin-dashboard');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="flex justify-center">
          <div className="bg-farm-600 text-white p-3 rounded-2xl shadow-lg">
            <Sprout className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-black text-gray-900 tracking-tight">
          Create Your FarmMitra Account
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          Join the direct agricultural marketplace in India
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100 sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Role Selector Cards */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('FARMER')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                    role === 'FARMER'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Sprout className={`w-5 h-5 ${role === 'FARMER' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className="text-xs">Farmer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                    role === 'BUYER'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <ShoppingBag className={`w-5 h-5 ${role === 'BUYER' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="text-xs">Buyer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                    role === 'ADMIN'
                      ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <ShieldCheck className={`w-5 h-5 ${role === 'ADMIN' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className="text-xs">Admin</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {role === 'BUYER' ? 'Business / Organization Name' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'BUYER' ? 'Wholesale Agro Traders' : 'Ramesh Kumar'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Buyer Type Selector (Only for Buyer role) */}
            {role === 'BUYER' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Buyer Category / Organization Type
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm font-bold text-gray-800 outline-none"
                  >
                    {BUYER_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none transition-all text-sm"
              />
            </div>

            {/* Phone & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Location (District, State)
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Bidar, Karnataka"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
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
                <span>Registering...</span>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-farm-700 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
