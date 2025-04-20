
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/database.types";
import type { AuthError, Session } from "@supabase/supabase-js";

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

  const handleUserSession = async (session: Session | null) => {
    if (!session) {
      setUser(null);
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      const userWithProfile: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: profile?.name || session.user.email?.split('@')[0] || 'User',
        avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${session.user.email}`,
      };

      setUser(userWithProfile);
    } catch (error) {
      console.error("Session handling error:", error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        await handleUserSession(session);
      } finally {
        setLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      await handleUserSession(session);
    });

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login')) {
          toast.error("Invalid email or password");
        } else if (error.message.includes('Email not confirmed')) {
          toast.error("Please verify your email before logging in");
        } else {
          toast.error(error.message);
        }
        return false;
      }

      if (data?.user) {
        toast.success("Welcome back!");
        return true;
      }

      return false;
    } catch (error) {
      const err = error as AuthError;
      console.error("Login error:", err);
      toast.error(err.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: user.id,
              name,
              avatar_url: `https://api.dicebear.com/7.x/personas/svg?seed=${email}`,
              joined_date: new Date().toISOString()
            }
          ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast.error("Account created but profile setup failed");
        }

        toast.success("Account created! Please check your email to confirm your account.");
        return true;
      }

      return false;
    } catch (error) {
      const err = error as AuthError;
      console.error("Registration error:", err);
      toast.error(err.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
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
