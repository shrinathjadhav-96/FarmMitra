import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { CloudWatchDashboardWidget } from '../components/CloudWatchDashboardWidget';
import { ShieldCheck, Users, Sprout, TrendingUp, CheckCircle, Clock, XCircle, AlertTriangle, UserCheck, ShieldAlert, Building2, CheckCircle2, Activity } from 'lucide-react';

export const AdminDashboard = () => {
  const { user, DEMO_USERS } = useAuth();
  const [activeTab, setActiveTab] = useState('cloudwatch'); // 'cloudwatch' | 'users' | 'pending' | 'verified'
  const [usersList, setUsersList] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const loadAllUsers = async () => {
    const registered = await userService.getUsers();
    setUsersList([...DEMO_USERS, ...registered]);
  };

  useEffect(() => {
    loadAllUsers();
  }, [DEMO_USERS]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    setUsersList(prev => prev.map(u => {
      if (u.userId === userId) {
        return { ...u, verificationStatus: newStatus };
      }
      return u;
    }));

    await userService.updateVerificationStatus(userId, newStatus);
    showToast(`User status updated to ${newStatus}`);
  };

  const pendingBuyers = usersList.filter(u => u.role === 'BUYER' && u.verificationStatus === 'PENDING');
  const verifiedBuyers = usersList.filter(u => u.role === 'BUYER' && u.verificationStatus === 'VERIFIED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-purple-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-purple-700/30">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <ShieldCheck className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white">
            <ShieldCheck className="w-3.5 h-3.5" /> Trust, Observability & Admin Console
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Welcome, Admin!
          </h1>
          <p className="text-purple-100 text-sm sm:text-base font-normal">
            Monitor real-time CloudWatch telemetry, verify commercial buyer accounts, and enforce platform safety.
          </p>
        </div>
      </div>

      {/* CloudWatch Observability Telemetry Widget */}
      <CloudWatchDashboardWidget />

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6 sm:space-x-8" aria-label="Admin Tabs">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-bold text-sm sm:text-base transition-colors ${
              activeTab === 'users'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-5 h-5" />
            All Platform Users ({usersList.length})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-bold text-sm sm:text-base transition-colors ${
              activeTab === 'pending'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="w-5 h-5 text-amber-600" />
            Pending Buyers ({pendingBuyers.length})
          </button>

          <button
            onClick={() => setActiveTab('verified')}
            className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-bold text-sm sm:text-base transition-colors ${
              activeTab === 'verified'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Verified Buyers ({verifiedBuyers.length})
          </button>
        </nav>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">
            {activeTab === 'pending' ? 'Pending Buyer Verification Applications' : activeTab === 'verified' ? 'Verified Buyer Directory' : 'All Registered Platform Users'}
          </h3>
          <span className="text-xs text-gray-500">
            {activeTab === 'pending' ? pendingBuyers.length : activeTab === 'verified' ? verifiedBuyers.length : usersList.length} records
          </span>
        </div>

        <div className="divide-y divide-gray-100 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">User / Business</th>
                <th className="px-6 py-3">Role & Category</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Verification Badge</th>
                <th className="px-6 py-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(activeTab === 'pending' ? pendingBuyers : activeTab === 'verified' ? verifiedBuyers : usersList).map((u) => (
                <tr key={u.userId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="font-bold text-gray-900">{u.name}</div>
                    <div className="text-xs text-gray-400 font-normal">{u.email} • {u.phone || 'No phone'}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold w-max ${
                        u.role === 'FARMER' ? 'bg-emerald-100 text-emerald-800' :
                        u.role === 'BUYER' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {u.role}
                      </span>
                      {u.buyerType && (
                        <span className="text-[10px] text-gray-500 font-semibold">{u.buyerType}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">{u.location || '—'}</td>

                  <td className="px-6 py-4">
                    {u.verificationStatus === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> ✓ Verified Buyer
                      </span>
                    ) : u.verificationStatus === 'REJECTED' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-800 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                        <XCircle className="w-3.5 h-3.5 text-red-600" /> Rejected
                      </span>
                    ) : u.verificationStatus === 'DISABLED' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-200 px-3 py-1 rounded-full">
                        <ShieldAlert className="w-3.5 h-3.5 text-gray-600" /> Disabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {u.verificationStatus !== 'VERIFIED' && (
                        <button
                          onClick={() => handleUpdateStatus(u.userId, 'VERIFIED')}
                          className="text-xs font-bold text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-200 transition-all flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Verify
                        </button>
                      )}

                      {u.verificationStatus !== 'REJECTED' && (
                        <button
                          onClick={() => handleUpdateStatus(u.userId, 'REJECTED')}
                          className="text-xs font-bold text-red-700 hover:text-white bg-red-50 hover:bg-red-600 px-3 py-1.5 rounded-xl border border-red-200 transition-all"
                        >
                          Reject
                        </button>
                      )}

                      {u.verificationStatus !== 'DISABLED' && (
                        <button
                          onClick={() => handleUpdateStatus(u.userId, 'DISABLED')}
                          className="text-xs font-bold text-gray-600 hover:text-white bg-gray-100 hover:bg-gray-800 px-3 py-1.5 rounded-xl transition-all"
                        >
                          Disable
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
