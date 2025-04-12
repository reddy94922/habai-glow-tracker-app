
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Calendar, Check, Clock, Flame } from "lucide-react";

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    category: string;
    streak: number;
    target: number;
    completed: number;
    completionRate: number;
    color: string;
  };
  onClick?: () => void;
}

const HabitCard = ({ habit, onClick }: HabitCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "glassmorphism overflow-hidden p-5 card-hover",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <p className="text-gray-400 text-xs">{habit.category}</p>
          <div className="flex items-center">
            <Flame className="w-4 h-4 text-orange-500 mr-1" />
            <span className="text-white text-sm font-medium">{habit.streak}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-white mb-2">{habit.name}</h3>
        
        <div className="mt-auto">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{habit.completed}/{habit.target} days</span>
            <span>{habit.completionRate}%</span>
          </div>
          <Progress 
            value={habit.completionRate} 
            className="h-1.5 bg-gray-700"
            indicatorClassName={`bg-[${habit.color}]`}
          />
          
          <div className="flex items-center mt-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-neon-lime/10 text-neon-lime">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-gray-400 ml-2">Last completed today</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HabitCard;
