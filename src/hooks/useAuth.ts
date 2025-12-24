import { useState, useEffect } from 'react';
import { User } from '@/types/video';

const STORAGE_KEY = 'video_app_user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Mock authentication - in real app, this would call an API
    if (email && password.length >= 6) {
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return true;
    }
    return false;
  };

  const signup = (email: string, password: string, name: string): boolean => {
    if (email && password.length >= 6 && name) {
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return { user, isLoading, login, signup, logout };
};
