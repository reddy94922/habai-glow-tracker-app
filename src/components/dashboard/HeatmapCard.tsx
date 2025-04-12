
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { weeklyHeatmapData } from "@/lib/mock-data";
import { Clock } from "lucide-react";

interface HeatmapCardProps {
  className?: string;
  onClick?: () => void;
}

const HeatmapCard = ({ className, onClick }: HeatmapCardProps) => {
  const timeSlots = ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const getIntensityClass = (value: number) => {
    if (value === 0) return "bg-gray-800";
    if (value === 1) return "bg-neon-lime/20";
    if (value === 2) return "bg-neon-lime/50";
    return "bg-neon-lime";
  };
  
  return (
    <Card
      onClick={onClick}
      className={cn(
        "glassmorphism p-5 card-hover",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white font-medium">Activity Heatmap</h3>
        <div className="text-neon-lime">
          <Clock size={18} />
        </div>
      </div>
      
      <div className="flex text-xs text-gray-500 mb-2">
        <div className="w-8"></div>
        {timeSlots.map((slot, i) => (
          <div key={i} className="flex-1 text-center">{i % 2 === 0 ? slot : ""}</div>
        ))}
      </div>
      
      <div className="space-y-2 mb-4">
        {weeklyHeatmapData.map((dayData, dayIndex) => (
          <div key={dayIndex} className="flex items-center">
            <div className="w-8 text-xs text-gray-400">{days[dayIndex]}</div>
            <div className="flex flex-1">
              {dayData.hours.map((value, hourIndex) => (
                <div
                  key={hourIndex}
                  className={cn(
                    "flex-1 h-6 rounded mx-0.5",
                    getIntensityClass(value)
                  )}
                  title={`${value} hours on ${days[dayIndex]} at ${timeSlots[hourIndex]}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-end mt-2 space-x-3">
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded bg-gray-800 mr-1.5"></div>
          <span className="text-xs text-gray-400">None</span>
        </div>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded bg-neon-lime/20 mr-1.5"></div>
          <span className="text-xs text-gray-400">Low</span>
        </div>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded bg-neon-lime/50 mr-1.5"></div>
          <span className="text-xs text-gray-400">Med</span>
        </div>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded bg-neon-lime mr-1.5"></div>
          <span className="text-xs text-gray-400">High</span>
        </div>
      </div>
    </Card>
  );
};

export default HeatmapCard;
