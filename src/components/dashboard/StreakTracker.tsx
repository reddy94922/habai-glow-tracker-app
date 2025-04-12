
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate, getWeekDates } from "@/lib/date-utils";

interface StreakTrackerProps {
  className?: string;
  onClick?: () => void;
}

const StreakTracker = ({ className, onClick }: StreakTrackerProps) => {
  const weekDates = getWeekDates();
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1; // Adjust for our Monday-start week
  
  return (
    <Card
      onClick={onClick}
      className={cn(
        "glassmorphism p-5 card-hover",
        onClick && "cursor-pointer",
        className
      )}
    >
      <h3 className="text-white font-medium mb-4">Weekly Streak</h3>
      
      <div className="flex justify-between mb-6">
        {weekDates.map((date, index) => {
          const isToday = index === adjustedToday;
          const isPast = index < adjustedToday;
          const datePart = date.getDate();
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center"
            >
              <span className="text-xs text-gray-400 mb-2">
                {date.toString().split(' ')[0]}
              </span>
              
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                  isToday && "neon-border text-neon-lime",
                  isPast && "bg-neon-lime/20 text-neon-lime",
                  !isToday && !isPast && "bg-gray-800 text-gray-400"
                )}
              >
                {datePart}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <span className="text-gray-400 text-sm">Current Streak</span>
          <p className="text-white font-bold text-xl">7 Days</p>
        </div>
        
        <div className="px-3 py-1.5 rounded-full bg-neon-lime/10 text-neon-lime text-xs font-medium">
          Best: 15 Days
        </div>
      </div>
    </Card>
  );
};

export default StreakTracker;
