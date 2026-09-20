import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-gradient-to-b from-farm-50/50 to-white">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
        {/* Sub-badge */}
        <div className="inline-flex items-center gap-2 bg-farm-100 text-farm-800 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase mb-6">
          <Sprout className="w-4 h-4 text-farm-600" /> Direct Farmer-to-Buyer Marketplace
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Connect Farmers Directly with <span className="text-farm-600 underline decoration-farm-300">Verified Buyers</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          FarmMitra empowers farmers to discover competing price offers for their crops, breaking reliance on single local traders.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link
            to={user ? (user.role === 'FARMER' ? '/farmer-dashboard' : '/buyer-dashboard') : '/register?role=FARMER'}
            className="w-full sm:w-auto bg-farm-600 hover:bg-farm-700 text-white font-black text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
          >
            <span>SELL MY CROP</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={user ? '/buyer-dashboard' : '/register?role=BUYER'}
            className="w-full sm:w-auto bg-white border-2 border-farm-600 text-farm-800 hover:bg-farm-50 font-bold text-lg px-8 py-4 rounded-2xl shadow-sm transition-all text-center"
          >
            FIND CROPS
          </Link>
        </div>

        {/* Core Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left mt-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-farm-100 rounded-xl flex items-center justify-center text-farm-700 mb-4">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">1. List Your Crop</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Enter crop details, expected price, harvest date, and quantity in simple mobile-friendly steps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">2. Receive & Compare</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Multiple verified wholesalers and commercial buyers submit transparent price offers for your produce.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">3. Direct Deal</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Accept the best offer to lock in direct deals with transparent terms and verified buyers.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>© 2026 FarmMitra. Transparent Agricultural Marketplace.</p>
        </div>
      </footer>
    </div>
  );
};

