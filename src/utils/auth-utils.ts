
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/database.types";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

export const handleUserSession = async (session: Session | null): Promise<User | null> => {
  if (!session) {
    return null;
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: profile?.name || session.user.email?.split('@')[0] || 'User',
      avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${session.user.email}`,
    };
  } catch (error) {
    console.error("Session handling error:", error);
    return null;
  }
};

export const createUserProfile = async (
  userId: string, 
  name: string, 
  email: string
): Promise<boolean> => {
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([
        {
          id: userId,
          name,
          avatar_url: `https://api.dicebear.com/7.x/personas/svg?seed=${email}`,
          joined_date: new Date().toISOString()
        }
      ]);

    if (profileError) {
      console.error("Error creating profile:", profileError);
      toast.error("Account created but profile setup failed");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Profile creation error:", error);
    return false;
  }
};
