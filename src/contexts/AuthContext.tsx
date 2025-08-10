import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export type UserRole = 'student' | 'teacher';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  walletAddress: string;
  token: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (username: string, email: string, password: string, walletAddress: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('skillchain_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/login`, { email, password });
      if (data && data.role === role) {
        const newUser: User = { ...data, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}` };
        setUser(newUser);
        localStorage.setItem('skillchain_user', JSON.stringify(newUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login failed', error);
    }
    setIsLoading(false);
    return false;
  };

  const signup = async (username: string, email: string, password: string, walletAddress: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/signup`, { username, email, password, walletAddress, role });
      if (data) {
        const newUser: User = { ...data, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}` };
        setUser(newUser);
        localStorage.setItem('skillchain_user', JSON.stringify(newUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Signup failed', error);
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillchain_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};