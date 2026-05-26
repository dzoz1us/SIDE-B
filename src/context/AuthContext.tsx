import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types';
import { getProfile, logout as logoutService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  handleLogout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  handleLogout: () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (err: any) {
      console.error("Ошибка загрузки профиля:", err);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, handleLogout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};