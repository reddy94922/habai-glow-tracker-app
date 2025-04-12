
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("habit-tracker-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("habit-tracker-user");
      }
    }
    setLoading(false);
  }, []);

  // Mock login function (would connect to backend in production)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo account for testing
      if (email === "demo@example.com" && password === "password") {
        const userData = {
          id: "user-1",
          email: "demo@example.com",
          name: "Demo User",
          avatar: "https://api.dicebear.com/7.x/personas/svg?seed=demo"
        };
        
        setUser(userData);
        localStorage.setItem("habit-tracker-user", JSON.stringify(userData));
        toast.success("Logged in successfully");
        return true;
      }
      
      // Mock successful login for any credentials in demo mode
      const userData = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        email,
        name: email.split("@")[0],
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${email}`
      };
      
      setUser(userData);
      localStorage.setItem("habit-tracker-user", JSON.stringify(userData));
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      toast.error("Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Mock register function
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${email}`
      };
      
      setUser(userData);
      localStorage.setItem("habit-tracker-user", JSON.stringify(userData));
      toast.success("Account created successfully");
      return true;
    } catch (error) {
      toast.error("Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("habit-tracker-user");
    toast.info("Logged out");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
