
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/database.types";
import { AuthContextType } from "@/types/auth.types";
import { useAuthActions } from "@/hooks/useAuthActions";
import { handleUserSession } from "@/utils/auth-utils";

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
  const { login, register, logout: performLogout, loading: actionLoading } = useAuthActions();

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        const user = await handleUserSession(session);
        setUser(user);
      } finally {
        setLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      const user = await handleUserSession(session);
      setUser(user);
    });

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading: loading || actionLoading,
    login,
    register,
    logout: performLogout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
