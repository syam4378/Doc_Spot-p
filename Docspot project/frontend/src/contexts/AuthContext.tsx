import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getUsers, addUser, updateUser, generateSampleData } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate sample data on first load
    generateSampleData();
    
    // Check for existing session
    const currentUserId = localStorage.getItem('current_user_id');
    if (currentUserId) {
      const users = getUsers();
      const currentUser = users.find(u => u.id === currentUserId);
      if (currentUser) {
        setUser(currentUser);
      }
    }
    
    setIsLoading(false);
  }, []);

  const signup = async (name: string, email: string, password: string, role: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Check if user already exists
      const existingUsers = getUsers();
      if (existingUsers.find(u => u.email === email)) {
        return { success: false, error: 'User with this email already exists' };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: role as 'patient' | 'doctor' | 'admin',
        createdAt: new Date().toISOString()
      };

      addUser(newUser);
      
      // Store password separately (in real app, this would be hashed)
      localStorage.setItem(`password_${email}`, password);
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const users = getUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const storedPassword = localStorage.getItem(`password_${email}`);
      if (storedPassword !== password) {
        return { success: false, error: 'Invalid password' };
      }

      setUser(user);
      localStorage.setItem('current_user_id', user.id);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...userData };
      updateUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('current_user_id');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      updateProfile, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};