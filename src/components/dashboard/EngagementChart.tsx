
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockWeeklyData } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";

interface EngagementChartProps {
  className?: string;
  onClick?: () => void;
}

const EngagementChart = ({ className, onClick }: EngagementChartProps) => {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");
  
  return (
    <Card
      onClick={onClick ? onClick : undefined}
      className={cn(
        "glassmorphism p-5",
        onClick && "card-hover cursor-pointer",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white font-medium">Habit Engagement</h3>
        <div className="text-neon-lime">
          <BarChart2 size={18} />
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-xs",
            timeframe === "weekly" 
              ? "bg-neon-lime/10 text-neon-lime hover:bg-neon-lime/20" 
              : "hover:bg-gray-800 text-gray-400"
          )}
          onClick={(e) => {
            e.stopPropagation();
            setTimeframe("weekly");
          }}
        >
          Weekly
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-xs",
            timeframe === "monthly" 
              ? "bg-neon-lime/10 text-neon-lime hover:bg-neon-lime/20" 
              : "hover:bg-gray-800 text-gray-400"
          )}
          onClick={(e) => {
            e.stopPropagation();
            setTimeframe("monthly");
          }}
        >
          Monthly
        </Button>
      </div>
      
      <div className="h-[180px] mt-2 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockWeeklyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
            />
            <YAxis 
              hide={true}
              domain={[0, 100]} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#282A36',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ color: '#CCFF99' }}
              formatter={(value: number) => [`${value}%`, 'Completion']}
              labelStyle={{ color: 'white' }}
            />
            <Bar 
              dataKey="completion" 
              fill="#CCFF99" 
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <span className="text-gray-400 text-sm">Average Rate</span>
          <p className="text-white font-bold text-xl">73.5%</p>
        </div>
        
        <div className="px-3 py-1.5 rounded-full bg-neon-lime/10 text-neon-lime text-xs font-medium">
          +12% vs previous
        </div>
      </div>
    </Card>
  );
};

export default EngagementChart;
