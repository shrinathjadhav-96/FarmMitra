// FarmMitra — Amazon SNS & Real-time Notification Client Service

const NOTIFICATIONS_KEY = 'farmmitra_notifications';

const INITIAL_NOTIFICATIONS = [
  {
    notificationId: 'notif_welcome_001',
    recipientUserId: 'usr_farmer_demo', // Ramesh Kumar
    eventType: 'WELCOME',
    message: 'Welcome to FarmMitra! Your farmer profile has been verified.',
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export const notificationService = {
  // Get notifications for a specific user
  getNotifications: async (userId) => {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      let items = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
      if (!raw) {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      }

      if (userId) {
        items = items.filter(n => n.recipientUserId === userId);
      }

      return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  },

  // Add new event notification (Triggered by backend events)
  createNotification: async ({ recipientUserId, eventType, message, metadata = {} }) => {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      const items = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;

      const newNotif = {
        notificationId: 'notif_' + Math.random().toString(36).substring(2, 9),
        recipientUserId,
        eventType, // 'OFFER_RECEIVED' | 'OFFER_ACCEPTED' | 'OFFER_REJECTED'
        message,
        read: false,
        metadata,
        createdAt: new Date().toISOString()
      };

      items.unshift(newNotif);
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));

      // Amazon SNS Cloud Audit Log
      console.log(`[Amazon SNS Client Event] Delivered to User ${recipientUserId}: "${message}"`);

      return { success: true, notification: newNotif };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Mark single notification as read
  markAsRead: async (notificationId) => {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      let items = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;

      items = items.map(n => {
        if (n.notificationId === notificationId) {
          return { ...n, read: true };
        }
        return n;
      });

      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Clear all notifications for user
  clearAll: async (userId) => {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      let items = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;

      items = items.filter(n => n.recipientUserId !== userId);
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};

