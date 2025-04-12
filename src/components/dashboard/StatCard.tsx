
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

const StatCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
  onClick
}: StatCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "glassmorphism overflow-hidden p-6 card-hover",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          
          {description && (
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          )}
          
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? "+" : "-"}{trend.value}%
              </span>
              <span className="text-xs text-gray-400 ml-1">vs last week</span>
            </div>
          )}
        </div>
        
        <div className="text-neon-lime">{icon}</div>
      </div>
    </Card>
  );
};

export default StatCard;
