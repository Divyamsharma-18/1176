import axios from 'axios';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '@/types/types';
import { mockApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await mockApiService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials, {
        withCredentials: true, 
      });
      if (!res.data.token) {
  console.error("No token received:", res.data);
  throw new Error("Login failed. No token.");
}
localStorage.setItem('token', res.data.token);

    setUser(res.data.user);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${res.data.user.username}`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || 'An error occurred during login',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:5000/api/auth/register', credentials);
    setUser(res.data.user);
      // setUser(response.user);
      toast({
        title: "Registration successful!",
        description: `Welcome, ${res.data.user.username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || 'An error occurred during registration',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await mockApiService.logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || 'An error occurred during logout',
        variant: "destructive",
      });
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    
    // Also update in localStorage to persist changes
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        isLoading, 
        login, 
        register, 
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
