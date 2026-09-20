import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X, CheckCircle2, AlertCircle, ShoppingBag, Handshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';

export const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const fetchUserNotifs = async () => {
    if (!user) return;
    const data = await notificationService.getNotifications(user.userId);
    setNotifications(data);
  };

  useEffect(() => {
    fetchUserNotifs();
    // Refresh notifications periodically
    const interval = setInterval(fetchUserNotifs, 4000);
    return () => clearInterval(interval);
  }, [user]);

  // Handle outside click to close drawer
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id) => {
    await notificationService.markAsRead(id);
    fetchUserNotifs();
  };

  const handleClearAll = async () => {
    await notificationService.clearAll(user.userId);
    fetchUserNotifs();
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'OFFER_RECEIVED':
        return <ShoppingBag className="w-4 h-4 text-amber-600" />;
      case 'OFFER_ACCEPTED':
        return <Handshake className="w-4 h-4 text-emerald-600" />;
      case 'OFFER_REJECTED':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-farm-700 hover:bg-farm-50 rounded-xl transition-all"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover Drawer */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-farm-400" />
              <h3 className="font-black text-sm">Notifications 🔔</h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-[11px] font-bold text-gray-400 hover:text-red-400 px-2 py-1 rounded transition-colors"
                  title="Clear all"
                >
                  Clear All
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.notificationId}
                  onClick={() => handleMarkRead(notif.notificationId)}
                  className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                    notif.read ? 'bg-white opacity-80' : 'bg-farm-50/60 font-semibold'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-gray-100 shrink-0 mt-0.5">
                    {getEventIcon(notif.eventType)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-gray-800 leading-snug">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-farm-600 shrink-0 mt-2"></span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs">
                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                No notifications yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

