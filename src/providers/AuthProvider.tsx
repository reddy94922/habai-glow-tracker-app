
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/database.types";

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

  // Check for session on load
  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        // Check if we have a session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          return;
        }
        
        if (session) {
          // We have a session, get user data
          const { data: userData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error("Error fetching user profile:", profileError);
          }
          
          const userWithProfile: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: userData?.name || session.user.email?.split('@')[0] || 'User',
            avatar: userData?.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${session.user.email}`,
          };
          
          setUser(userWithProfile);
        }
      } catch (error) {
        console.error("Session retrieval error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          setLoading(true);
          
          // Get user profile data
          const { data: userData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            console.error("Error fetching user profile:", profileError);
          }
          
          const userWithProfile: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: userData?.name || session.user.email?.split('@')[0] || 'User',
            avatar: userData?.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${session.user.email}`,
          };
          
          setUser(userWithProfile);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Invalid email or password. Please try again.");
        } else if (error.message.includes('Email not confirmed')) {
          toast.error("Please verify your email before logging in.");
        } else {
          toast.error(error.message || "Login failed");
        }
        return false;
      }
      
      toast.success("Logged in successfully");
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Register the user with auto-confirm enabled for testing
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Enable this for development to auto-confirm emails
          emailRedirectTo: window.location.origin,
          data: {
            name
          }
        }
      });
      
      if (error) {
        toast.error(error.message || "Registration failed");
        return false;
      }
      
      // Create a profile for the new user if signup was successful
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: data.user.id, 
                name,
                avatar_url: `https://api.dicebear.com/7.x/personas/svg?seed=${email}`,
                joined_date: new Date().toISOString()
              }
            ]);
          
          if (profileError) {
            console.error("Error creating user profile:", profileError);
            toast.error("Account created but profile setup failed");
          }
        } catch (profileError: any) {
          console.error("Error creating user profile:", profileError);
        }
        
        toast.success("Account created! Please check your email to confirm your account.");
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.info("Logged out");
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
