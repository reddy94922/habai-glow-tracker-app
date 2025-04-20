
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at?: string;
  last_sign_in?: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  frequency: string[];
  time_of_day?: string;
  reminder?: boolean;
  created_at: string;
  streak: number;
  total_completions: number;
  last_completed?: string;
  is_active: boolean;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  notes?: string;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  text: string;
  is_user: boolean;
  read: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  consistency_score?: number;
  longest_streak?: number;
  current_streak?: number;
  total_completions?: number;
  joined_date: string;
  last_active?: string;
}
