
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  Coffee,
  Dumbbell,
  Edit,
  Heart,
  Plus,
  Timer,
  Trash2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const habitCategories = [
  { value: "health", label: "Health", icon: Heart, color: "text-red-400" },
  { value: "focus", label: "Focus", icon: Zap, color: "text-yellow-400" },
  { value: "mindfulness", label: "Mindfulness", icon: Coffee, color: "text-blue-400" },
  { value: "productivity", label: "Productivity", icon: Timer, color: "text-neon-lime" },
  { value: "fitness", label: "Fitness", icon: Dumbbell, color: "text-purple-400" },
];

const plannerTabs = ["daily", "weekly"] as const;
type PlannerTab = typeof plannerTabs[number];

interface HabitInputProps {
  id: string;
  onRemove: (id: string) => void;
}

const HabitInput = ({ id, onRemove }: HabitInputProps) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-5 sm:col-span-6">
        <Input
          placeholder="Habit name"
          className="bg-dark border-gray-700 text-white"
        />
      </div>
      <div className="col-span-5 sm:col-span-5">
        <Select>
          <SelectTrigger className="bg-dark border-gray-700 text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-dark-secondary border-gray-700">
            {habitCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center">
                  <category.icon className={cn("mr-2 h-4 w-4", category.color)} />
                  <span>{category.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-2 sm:col-span-1 flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-red-500 hover:bg-red-500/10"
          onClick={() => onRemove(id)}
        >
          <Trash2 size={18} />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
};

// Sample AI-generated schedule
const morningActivities = [
  { time: "6:00 AM", activity: "Wake up & hydrate", category: "health", completed: false },
  { time: "6:15 AM", activity: "Morning meditation", category: "mindfulness", completed: true },
  { time: "7:00 AM", activity: "Exercise", category: "fitness", completed: false },
  { time: "8:00 AM", activity: "Breakfast", category: "health", completed: true },
];

const afternoonActivities = [
  { time: "12:00 PM", activity: "Lunch break", category: "health", completed: true },
  { time: "1:00 PM", activity: "Deep work session", category: "focus", completed: false },
  { time: "3:00 PM", activity: "No-phone break", category: "mindfulness", completed: false },
];

const eveningActivities = [
  { time: "6:00 PM", activity: "Evening walk", category: "fitness", completed: false },
  { time: "8:00 PM", activity: "Journaling", category: "mindfulness", completed: false },
  { time: "10:00 PM", activity: "Screen-free wind down", category: "health", completed: false },
];

interface ScheduleSectionProps {
  title: string;
  activities: {
    time: string;
    activity: string;
    category: string;
    completed: boolean;
  }[];
}

const ScheduleSection = ({ title, activities }: ScheduleSectionProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-white text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-3">
        {activities.map((item, index) => {
          const category = habitCategories.find(
            (c) => c.value === item.category
          );
          const Icon = category?.icon || Coffee;
          const color = category?.color || "text-gray-400";
          
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-dark rounded-lg border border-gray-800"
            >
              <div className={`p-2 rounded-full bg-gray-800 ${color}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{item.activity}</p>
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock size={14} className="mr-1" />
                  <span>{item.time}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full",
                  item.completed
                    ? "bg-neon-lime/20 text-neon-lime hover:bg-neon-lime/30"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800/80"
                )}
              >
                <CheckCircle2 size={18} />
                <span className="sr-only">Mark as complete</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-gray-800/50 text-gray-400 hover:bg-gray-800/80"
              >
                <Edit size={16} />
                <span className="sr-only">Edit</span>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Planner = () => {
  const [habits, setHabits] = useState<string[]>(["habit-1"]);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<PlannerTab>("daily");

  const addHabit = () => {
    setHabits([...habits, `habit-${habits.length + 1}`]);
  };

  const removeHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <DashboardLayout 
      title="Habit Planner" 
      description="Plan and organize your daily and weekly habits for maximum consistency."
    >
      <Tabs
        defaultValue="daily"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as PlannerTab)}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <TabsList className="bg-dark-secondary border border-gray-800">
            <TabsTrigger 
              value="daily" 
              className={activeTab === "daily" ? "data-[state=active]:bg-neon-lime data-[state=active]:text-gray-900" : ""}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Daily View
            </TabsTrigger>
            <TabsTrigger 
              value="weekly" 
              className={activeTab === "weekly" ? "data-[state=active]:bg-neon-lime data-[state=active]:text-gray-900" : ""}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Weekly View
            </TabsTrigger>
          </TabsList>

          <Button 
            variant="outline" 
            size="sm" 
            className="border-neon-lime/50 text-neon-lime hover:bg-neon-lime/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Habit
          </Button>
        </div>

        <TabsContent value="daily" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {!submitted ? (
                <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
                  <h3 className="text-white text-xl font-medium mb-6">Create Your Habit Plan</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="habit-count">Number of Habits</Label>
                          <Input
                            id="habit-count"
                            type="number"
                            min="1"
                            max="10"
                            defaultValue={habits.length}
                            onChange={(e) => {
                              const count = parseInt(e.target.value);
                              if (count > habits.length) {
                                setHabits([
                                  ...habits,
                                  ...Array(count - habits.length)
                                    .fill(0)
                                    .map((_, i) => `habit-${habits.length + i + 1}`),
                                ]);
                              } else if (count < habits.length) {
                                setHabits(habits.slice(0, count));
                              }
                            }}
                            className="bg-dark border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">Planning Duration</Label>
                          <Select defaultValue="30">
                            <SelectTrigger 
                              id="duration"
                              className="bg-dark border-gray-700 text-white"
                            >
                              <SelectValue placeholder="Days" />
                            </SelectTrigger>
                            <SelectContent className="bg-dark-secondary border-gray-700">
                              <SelectItem value="7">7 days</SelectItem>
                              <SelectItem value="14">14 days</SelectItem>
                              <SelectItem value="21">21 days</SelectItem>
                              <SelectItem value="30">30 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="block mb-4">Habit Details</Label>
                        <div className="space-y-4">
                          {habits.map((id) => (
                            <HabitInput
                              key={id}
                              id={id}
                              onRemove={removeHabit}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed border-gray-700 hover:border-neon-lime/50 hover:bg-transparent hover:text-neon-lime"
                        onClick={addHabit}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Another Habit
                      </Button>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-neon-lime hover:bg-neon-lime/80 text-gray-900"
                    >
                      Generate AI Habit Plan
                    </Button>
                  </form>
                </Card>
              ) : (
                <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-xl font-medium">Your Habit Schedule</h3>
                    <Button
                      variant="outline" 
                      size="sm" 
                      className="border-neon-lime/50 text-neon-lime hover:bg-neon-lime/10"
                      onClick={() => setSubmitted(false)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Plan
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-neon-lime/20 bg-gradient-to-b from-neon-lime/5 to-transparent rounded-lg mb-6">
                    <div className="flex items-center text-neon-lime mb-2">
                      <Zap className="mr-2 h-5 w-5" />
                      <h4 className="font-medium">AI Recommendation</h4>
                    </div>
                    <p className="text-gray-300">
                      Based on your habit goals, I've organized them throughout the day for optimal energy levels and consistency. Morning is ideal for energy-demanding habits like exercise, while evening is better for reflective practices like journaling.
                    </p>
                  </div>
                  
                  <ScheduleSection title="Morning Routine" activities={morningActivities} />
                  <ScheduleSection title="Afternoon Routine" activities={afternoonActivities} />
                  <ScheduleSection title="Evening Routine" activities={eveningActivities} />
                </Card>
              )}
            </div>
            
            {/* Insights and Tips */}
            <div className="space-y-6">
              <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
                <h3 className="text-white text-xl font-medium mb-4">Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-gray-800 bg-dark">
                    <div className="flex items-center text-blue-400 mb-2">
                      <Coffee className="mr-2 h-5 w-5" />
                      <h4 className="font-medium">Mindfulness First</h4>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Starting your day with a 5-minute meditation helps prime your mind for better focus throughout the day.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-gray-800 bg-dark">
                    <div className="flex items-center text-yellow-400 mb-2">
                      <Zap className="mr-2 h-5 w-5" />
                      <h4 className="font-medium">Energy Management</h4>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Schedule your most demanding tasks between 9 AM and 11 AM when your natural energy and focus typically peak.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-gray-800 bg-dark">
                    <div className="flex items-center text-neon-lime mb-2">
                      <Timer className="mr-2 h-5 w-5" />
                      <h4 className="font-medium">Habit Stacking</h4>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Try linking your new habits to existing ones. For example, do a quick stretch routine right after brushing your teeth.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
                <h3 className="text-white text-xl font-medium mb-4">Success Rate Prediction</h3>
                <div className="p-4 rounded-lg border border-gray-800 bg-dark mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">Morning Meditation</p>
                    <span className="text-neon-lime font-medium">94%</span>
                  </div>
                  <p className="text-xs text-gray-400">Based on your consistency with similar habits</p>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-800 bg-dark mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">Evening Journaling</p>
                    <span className="text-yellow-400 font-medium">68%</span>
                  </div>
                  <p className="text-xs text-gray-400">Consider setting a reminder to improve consistency</p>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-800 bg-dark">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">No-Phone Hour</p>
                    <span className="text-orange-400 font-medium">42%</span>
                  </div>
                  <p className="text-xs text-gray-400">This habit may need additional support strategies</p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-6">
          <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl font-medium">Weekly Calendar View</h3>
              <Select defaultValue="current">
                <SelectTrigger className="w-[180px] bg-dark border-gray-700 text-white">
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent className="bg-dark-secondary border-gray-700">
                  <SelectItem value="prev">Previous Week</SelectItem>
                  <SelectItem value="current">Current Week</SelectItem>
                  <SelectItem value="next">Next Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center text-gray-400 font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-6">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "min-h-[100px] p-2 rounded-lg border border-gray-800",
                    i === 2 ? "bg-neon-lime/5 border-neon-lime/30" : "bg-dark"
                  )}
                >
                  <div className="text-right text-sm text-gray-500 mb-2">
                    {new Date(Date.now() + i * 86400000).getDate()}
                  </div>
                  <div className="space-y-1">
                    {i < 5 && (
                      <>
                        <div className="bg-blue-500/10 text-xs p-1 rounded text-blue-400 truncate">
                          Meditation
                        </div>
                        <div className="bg-green-500/10 text-xs p-1 rounded text-green-400 truncate">
                          Exercise
                        </div>
                      </>
                    )}
                    {i === 2 && (
                      <div className="bg-yellow-500/10 text-xs p-1 rounded text-yellow-400 truncate">
                        Focus Block
                      </div>
                    )}
                    {i >= 5 && (
                      <div className="text-xs text-gray-500 italic">
                        No habits planned
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Reset View
              </Button>
              <Button 
                className="bg-neon-lime hover:bg-neon-lime/80 text-gray-900"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Planner;
