// FarmMitra — User & Amazon Cognito Verification Service
// Manages buyer profile attributes, verification states, and admin moderation

const USERS_KEY = 'farmmitra_registered_users';

export const BUYER_TYPES = [
  'Wholesaler',
  'Retailer',
  'Restaurant',
  'Supermarket',
  'Food Processor',
  'Other'
];

export const userService = {
  // Get all registered platform users
  getUsers: async () => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const registered = raw ? JSON.parse(raw) : [];
      return registered;
    } catch (err) {
      console.error('Error reading users:', err);
      return [];
    }
  },

  // Update user verification status (Admin Action)
  updateVerificationStatus: async (userId, newStatus) => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      let users = raw ? JSON.parse(raw) : [];

      const index = users.findIndex(u => u.userId === userId);
      if (index !== -1) {
        users[index].verificationStatus = newStatus;
        users[index].updatedAt = new Date().toISOString();
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Update active session user if currently logged in user is target
        const currentSession = localStorage.getItem('farmmitra_user');
        if (currentSession) {
          const parsed = JSON.parse(currentSession);
          if (parsed.userId === userId) {
            parsed.verificationStatus = newStatus;
            localStorage.setItem('farmmitra_user', JSON.stringify(parsed));
          }
        }

        console.log(`[Amazon Cognito Admin Update] User ${userId} status changed to ${newStatus}`);
        return { success: true, user: users[index] };
      }

      return { success: false, error: 'User not found' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};

