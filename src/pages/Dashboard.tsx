
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import HabitCard from "@/components/dashboard/HabitCard";
import StreakTracker from "@/components/dashboard/StreakTracker";
import HeatmapCard from "@/components/dashboard/HeatmapCard";
import EngagementChart from "@/components/dashboard/EngagementChart";
import AiSuggestionCard from "@/components/dashboard/AiSuggestionCard";
import MessagesCard from "@/components/dashboard/MessagesCard";
import { mockHabits } from "@/lib/mock-data";
import { CalendarCheck2, ListChecks, Flame, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Helper functions
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };
  
  // Event handlers
  const handleCardClick = (cardName: string) => {
    toast.info(`Opening ${cardName} details...`);
  };

  const title = `${getCurrentGreeting()}, ${user?.name}! 👋`;
  const description = "Here's an overview of your habits and progress.";

  return (
    <DashboardLayout title={title} description={description}>
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Habits"
          value="4"
          icon={<ListChecks size={24} />}
          description="2 due today"
          onClick={() => handleCardClick("Total Habits")}
        />
        
        <StatCard
          title="Current Streak"
          value="7 days"
          icon={<Flame size={24} />}
          trend={{ value: 12, isPositive: true }}
          onClick={() => handleCardClick("Streak")}
        />
        
        <StatCard
          title="This Week"
          value="15/20"
          icon={<CalendarCheck2 size={24} />}
          description="75% completion"
          onClick={() => handleCardClick("Weekly Progress")}
        />
        
        <StatCard
          title="Consistency"
          value="85%"
          icon={<TrendingUp size={24} />}
          trend={{ value: 7, isPositive: true }}
          onClick={() => handleCardClick("Consistency")}
        />
      </div>
      
      {/* Habits Row */}
      <h2 className="text-xl font-medium text-white mb-4">Your Habits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {mockHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onClick={() => handleCardClick(habit.name)}
          />
        ))}
      </div>
      
      {/* Dashboard Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StreakTracker
          className="md:col-span-2 lg:col-span-1"
          onClick={() => handleCardClick("Streak Tracker")}
        />
        <HeatmapCard
          className="md:col-span-2 lg:col-span-1"
          onClick={() => handleCardClick("Heatmap")}
        />
        <EngagementChart
          className="md:col-span-2 lg:col-span-1"
          onClick={() => handleCardClick("Engagement Chart")}
        />
        <AiSuggestionCard
          className="md:col-span-1"
          onClick={() => handleCardClick("AI Suggestions")}
        />
        <MessagesCard
          className="md:col-span-1"
          onClick={() => handleCardClick("Messages")}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
