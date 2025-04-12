
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Filter } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

const timeRanges = ["Week", "Month", "Year"] as const;
type TimeRange = typeof timeRanges[number];

const categories = ["All", "Health", "Productivity", "Focus", "Mindfulness"] as const;
type Category = typeof categories[number];

// Mock data for charts
const streakData = [
  { name: "Mon", streak: 4 },
  { name: "Tue", streak: 5 },
  { name: "Wed", streak: 7 },
  { name: "Thu", streak: 8 },
  { name: "Fri", streak: 9 },
  { name: "Sat", streak: 10 },
  { name: "Sun", streak: 12 },
];

const completionData = [
  { name: "Week 1", health: 65, productivity: 78, focus: 62 },
  { name: "Week 2", health: 72, productivity: 82, focus: 68 },
  { name: "Week 3", health: 78, productivity: 85, focus: 75 },
  { name: "Week 4", health: 85, productivity: 90, focus: 82 },
];

const categoryData = [
  { name: "Health", value: 40, color: "#CCFF99" },
  { name: "Productivity", value: 30, color: "#00469B" },
  { name: "Focus", value: 20, color: "#8884d8" },
  { name: "Mindfulness", value: 10, color: "#82ca9d" },
];

const topHabits = [
  { name: "Daily Meditation", category: "Mindfulness", completion: 98 },
  { name: "Morning Exercise", category: "Health", completion: 92 },
  { name: "Deep Work", category: "Focus", completion: 87 },
];

const bottomHabits = [
  { name: "Evening Reading", category: "Mindfulness", completion: 42 },
  { name: "Journaling", category: "Productivity", completion: 35 },
  { name: "No Phone Hour", category: "Focus", completion: 28 },
];

const Reports = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("Week");
  const [category, setCategory] = useState<Category>("All");

  return (
    <DashboardLayout 
      title="Reports & Analytics" 
      description="Detailed analytics and insights about your habits and progress."
    >
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-dark-secondary p-1.5 rounded-lg flex">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-md",
                timeRange === range 
                  ? "bg-neon-lime text-gray-900 hover:bg-neon-lime/90 hover:text-gray-900" 
                  : "text-gray-400 hover:text-white"
              )}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
        
        <div className="bg-dark-secondary p-1.5 rounded-lg flex flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-md",
                category === cat 
                  ? "bg-neon-lime text-gray-900 hover:bg-neon-lime/90 hover:text-gray-900" 
                  : "text-gray-400 hover:text-white"
              )}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="ml-auto border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <Filter size={16} className="mr-2" />
          More Filters
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="border-neon-lime/50 text-neon-lime hover:bg-neon-lime/10"
        >
          <Download size={16} className="mr-2" />
          Export Report
        </Button>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-dark-secondary border-gray-800 shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Completion Rate</h3>
            <span className="text-neon-lime text-xs font-medium px-2 py-1 rounded-full bg-neon-lime/10">
              +12% from last {timeRange.toLowerCase()}
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-white text-3xl font-bold">87%</span>
          </div>
          <Progress value={87} className="h-1.5 mt-3" indicatorClassName="bg-neon-lime" />
        </Card>
        
        <Card className="bg-dark-secondary border-gray-800 shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Streak Status</h3>
            <span className="text-neon-lime text-xs font-medium px-2 py-1 rounded-full bg-neon-lime/10">
              Active
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-white text-3xl font-bold">12 days</span>
          </div>
          <Progress value={40} className="h-1.5 mt-3" indicatorClassName="bg-neon-lime" />
          <p className="text-xs text-gray-500 mt-2">30 days to reach your goal</p>
        </Card>
        
        <Card className="bg-dark-secondary border-gray-800 shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Habits Tracked</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-white text-3xl font-bold">27</span>
            <span className="text-gray-400 text-sm">total habits</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">Active: 8</span>
            <span className="text-xs text-gray-500">Completed: 12</span>
            <span className="text-xs text-gray-500">Paused: 7</span>
          </div>
        </Card>
        
        <Card className="bg-dark-secondary border-gray-800 shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Success Rate</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-white text-3xl font-bold">78%</span>
          </div>
          <Progress value={78} className="h-1.5 mt-3" indicatorClassName="bg-neon-lime" />
          <p className="text-xs text-gray-500 mt-2">Based on completed vs. missed habits</p>
        </Card>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-medium">Streak Growth</h3>
          </div>
          <ChartContainer config={{ default: {} }} className="h-[300px]">
            <LineChart data={streakData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="streak" 
                name="Streak Days" 
                stroke="#CCFF99" 
                strokeWidth={2}
                dot={{ stroke: '#CCFF99', strokeWidth: 2, r: 4, fill: '#121212' }}
                activeDot={{ r: 6, stroke: '#CCFF99', strokeWidth: 2, fill: '#CCFF99' }}
              />
            </LineChart>
          </ChartContainer>
        </Card>
        
        <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-medium">Habit Completion by Category</h3>
          </div>
          <ChartContainer config={{ default: {} }} className="h-[300px]">
            <BarChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="health" name="Health" fill="#CCFF99" radius={[4, 4, 0, 0]} />
              <Bar dataKey="productivity" name="Productivity" fill="#00469B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="focus" name="Focus" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </Card>
      </div>
      
      {/* Categories and Habits Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-medium">Categories Distribution</h3>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Top Performing Habits */}
        <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-medium">Top Performing Habits</h3>
          </div>
          <div className="space-y-4">
            {topHabits.map((habit, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{habit.name}</span>
                  <span className="text-neon-lime">{habit.completion}%</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{habit.category}</span>
                </div>
                <Progress value={habit.completion} className="h-1.5" indicatorClassName="bg-neon-lime" />
              </div>
            ))}
          </div>
        </Card>
        
        {/* Needs Improvement Habits */}
        <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-medium">Needs Improvement</h3>
          </div>
          <div className="space-y-4">
            {bottomHabits.map((habit, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{habit.name}</span>
                  <span className="text-orange-400">{habit.completion}%</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{habit.category}</span>
                </div>
                <Progress value={habit.completion} className="h-1.5" indicatorClassName="bg-orange-400" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
