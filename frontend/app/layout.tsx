// frontend/app/layout.tsx (FIXED VERSION)

'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import './globals.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define the shape of the User and Context for TypeScript
interface User {
  email: string;
  first_name: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean; // <--- ADDED LOADING STATE
  login: (accessToken: string, userData: User) => void;
  logout: () => void;
}

// 1. Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 2. Auth Provider Component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // <--- INITIALIZE LOADING
  const router = useRouter();

  // Load token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const userData: User = JSON.parse(storedUser);
        setUser(userData);
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false); // <--- SET LOADING TO FALSE AFTER CHECK
  }, []);

  const login = useCallback((accessToken: string, userData: User) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  // Use useMemo and include 'loading'
  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: !!token,
    loading, // <--- PROVIDE LOADING STATE
    login,
    logout
  }), [token, user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Root Layout (including Navbar)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <header>
            <nav className="navbar">
              <Link href="/">
                <span className="logo">Dyslexia Support System</span>
              </Link>
              <AuthLinks />
            </nav>
          </header>
          <main className="container">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

// 4. Navbar Links (uses AuthContext)
const AuthLinks = () => {
  const { isAuthenticated, logout, user, loading } = useAuth(); // <--- INCLUDE LOADING

  if (loading) {
    return <div className="nav-links">Loading...</div>; // Prevent rendering links until check is done
  }

  return (
    <div className="nav-links">
      {isAuthenticated ? (
        <>
          <span className="welcome">Welcome, {user?.first_name || 'User'}</span>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/assessment">Assessment</Link>
          <Link href="/screening">Readiness Check</Link>
          <Link href="/skill-quest">Skill Quests</Link>
          <Link href="/learn">Phonics Adventures</Link>
          <Link href="/chat">Smart Companion</Link>
          <Link href="/support">Support Hub</Link>
          
          <button onClick={logout} className="logout-btn">Logout</button>
        </>
      ) : (
        <>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
        </>
      )}
    </div>
  );
};