
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";
import { createUserProfile } from "@/utils/auth-utils";

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);

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
        const profileCreated = await createUserProfile(user.id, name, email);
        if (profileCreated) {
          toast.success("Account created! Please check your email to confirm your account.");
          return true;
        }
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
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return {
    loading,
    login,
    register,
    logout,
  };
};
