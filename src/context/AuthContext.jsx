import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext(null);

// Pre-seeded Demo Accounts for instant evaluation
const DEMO_USERS = [
  {
    userId: 'usr_farmer_demo',
    email: 'farmer@farmmitra.in',
    name: 'Ramesh Kumar',
    phone: '+91 9876543210',
    role: 'FARMER',
    location: 'Bidar, Karnataka',
    verificationStatus: 'VERIFIED',
    createdAt: new Date().toISOString()
  },
  {
    userId: 'usr_buyer_demo',
    email: 'buyer@farmmitra.in',
    name: 'Wholesale Agro Traders',
    phone: '+91 9123456789',
    role: 'BUYER',
    location: 'Bengaluru, Karnataka',
    verificationStatus: 'VERIFIED',
    createdAt: new Date().toISOString()
  },
  {
    userId: 'usr_admin_demo',
    email: 'admin@farmmitra.in',
    name: 'FarmMitra Admin',
    phone: '+91 9000000000',
    role: 'ADMIN',
    location: 'Headquarters, India',
    verificationStatus: 'VERIFIED',
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('farmmitra_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse saved user session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Register User
  const register = async ({ name, email, password, phone, role, location }) => {
    setLoading(true);
    try {
      // Create user record
      const newUser = {
        userId: 'usr_' + Math.random().toString(36).substring(2, 9),
        name,
        email,
        phone: phone || '',
        role: role.toUpperCase(), // 'FARMER' | 'BUYER' | 'ADMIN'
        location: location || 'India',
        verificationStatus: role.toUpperCase() === 'BUYER' ? 'PENDING' : 'VERIFIED',
        createdAt: new Date().toISOString()
      };

      // Persist registered user to local storage registry
      const existingUsers = JSON.parse(localStorage.getItem('farmmitra_registered_users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('farmmitra_registered_users', JSON.stringify(existingUsers));

      // Set current session
      setUser(newUser);
      localStorage.setItem('farmmitra_user', JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1. Check Demo Accounts first
      const demoAccount = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (demoAccount) {
        setUser(demoAccount);
        localStorage.setItem('farmmitra_user', JSON.stringify(demoAccount));
        setLoading(false);
        return { success: true, user: demoAccount };
      }

      // 2. Check Registered local users
      const registeredUsers = JSON.parse(localStorage.getItem('farmmitra_registered_users') || '[]');
      const registeredAccount = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (registeredAccount) {
        setUser(registeredAccount);
        localStorage.setItem('farmmitra_user', JSON.stringify(registeredAccount));
        setLoading(false);
        return { success: true, user: registeredAccount };
      }

      // Default fallback if brand new email typed: auto-create as chosen or default FARMER
      const fallbackUser = {
        userId: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email,
        role: 'FARMER',
        location: 'Karnataka',
        verificationStatus: 'VERIFIED',
        createdAt: new Date().toISOString()
      };

      setUser(fallbackUser);
      localStorage.setItem('farmmitra_user', JSON.stringify(fallbackUser));
      return { success: true, user: fallbackUser };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout User
  const logout = async () => {
    setUser(null);
    localStorage.removeItem('farmmitra_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

