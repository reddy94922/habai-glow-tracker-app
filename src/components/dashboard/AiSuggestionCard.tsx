
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { aiSuggestions } from "@/lib/mock-data";
import { BrainCircuit, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AiSuggestionCardProps {
  className?: string;
  onClick?: () => void;
}

const AiSuggestionCard = ({ className, onClick }: AiSuggestionCardProps) => {
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let nextSuggestion = currentSuggestion;
      while (nextSuggestion === currentSuggestion) {
        nextSuggestion = Math.floor(Math.random() * aiSuggestions.length);
      }
      setCurrentSuggestion(nextSuggestion);
      setLoading(false);
    }, 800);
  };
  
  const handleFeedback = (e: React.MouseEvent, isPositive: boolean) => {
    e.stopPropagation();
    toast.success(isPositive 
      ? "Thanks for your feedback! We'll suggest more like this." 
      : "Thanks for your feedback! We'll refine our suggestions.");
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
        <div className="flex items-center">
          <div className="mr-2 text-neon-purple">
            <BrainCircuit size={18} className="text-neon-purple" />
          </div>
          <h3 className="text-white font-medium">HabAI Suggestion</h3>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-gray-400 hover:text-neon-lime hover:bg-neon-lime/10 rounded-full"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw size={16} className={cn(loading && "animate-spin")} />
        </Button>
      </div>
      
      <div className="min-h-[80px] flex items-center justify-center">
        <p className="text-gray-200 text-sm text-center">
          "{aiSuggestions[currentSuggestion]}"
        </p>
      </div>
      
      <div className="flex justify-center space-x-2 mt-4">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => handleFeedback(e, true)}
          className="h-8 text-gray-400 hover:text-green-500 hover:bg-green-500/10"
        >
          <ThumbsUp size={15} className="mr-1" />
          <span className="text-xs">Helpful</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => handleFeedback(e, false)}
          className="h-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
        >
          <ThumbsDown size={15} className="mr-1" />
          <span className="text-xs">Not helpful</span>
        </Button>
      </div>
    </Card>
  );
};

export default AiSuggestionCard;
